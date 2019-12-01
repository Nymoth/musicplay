import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map, tap, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export type VideoThumbnail = {
  url: string;
  width: number;
  height: number;
}

export type Video = {
  id: string;
  title: string;
  description: string;
  publishedDate: Date;
  thumbnails: VideoThumbnail[];
}

export type VideosRequestOptions = {
  maxResults?: number;
  pageToken?: string;
  videoId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  private _videos = new BehaviorSubject(new Map());
  private _loading = new BehaviorSubject(false);

  constructor(private _httpClient: HttpClient) { }

  /**
   * Return stream of videos
   */
  getVideos(): Observable<Map<string, Video>> {
    return this._videos.asObservable();
  }

  /**
   * Return one specific video
   *
   * @param id youtubeId
   */
  getVideo(id: string): Observable<Video> {
    if (this._videos.value.has(id)) {
      return of(this._videos.value.get(id));
    }
    return this.loadVideos({ videoId: id, maxResults: 1 }).pipe(
      map(() => this._videos.value.get(id))
    );
  }

  /**
   * Return loading state
   */
  isLoading(): Observable<boolean> {
    return this._loading.asObservable();
  }

  /**
   * Given a page token will update the videos stream, and return the next page token
   *
   * @param options VideosRequestOptions
   */
  loadVideos(options: VideosRequestOptions): Observable<string> {
    if (this._loading.value) {
      return throwError('Still loading');
    }
    this._loading.next(true);
    const url = this._redactUrl(options);
    return this._httpClient.get(url).pipe(
      tap((res: any) => {
        const videos = this._extractVideos(res);
        const videosMap = this._videos.value;
        videos.forEach(video => videosMap.set(video.id, video));
        this._videos.next(videosMap);
      }),
      map((res: any) => res.nextPageToken),
      finalize(() => this._loading.next(false))
    );
  }

  private _redactUrl(options: VideosRequestOptions): string {
    const query = Object.keys(options)
      .filter(opt => options[opt] !== null)
      .map(opt => ({ key: opt, val: options[opt] }));
    query.push({ key: 'playlistId', val: environment.videos.playlistId });
    query.push({ key: 'key', val: environment.videos.key });
    return `${environment.videos.baseUrl}&${query.map(({ key, val }) => `${key}=${val}`).join('&')}`;
  }

  private _extractVideos(response: any): Video[] {
    return response.items
      .filter((item: any) => item.status.privacyStatus === 'public')
      .map((item: any) => ({
        id: item.contentDetails.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedDate: new Date(item.contentDetails.videoPublishedAt),
        thumbnails: Object.values(item.snippet.thumbnails)
      })
    );
  }
}
