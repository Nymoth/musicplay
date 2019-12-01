import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, HostListener, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { VideosService, Video } from 'src/app/services/videos.service';
import { StripesHandlerService } from 'src/app/services/stripes-handler.service';

@Component({
  selector: 'mp-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit, AfterViewInit {

  @ViewChild('scrollPoint', { static: true }) private _scrollPoint: ElementRef;

  videos$: Observable<Video[]>;
  transition = null;

  private _nextPageToken = null;
  private _canQueryMoreVideos = true;

  constructor(
    private _router: Router,
    private _changeDetector: ChangeDetectorRef,
    private _videosService: VideosService,
    private _stripesHandler: StripesHandlerService
  ) { }

  ngOnInit() {
    this.videos$ = this._videosService.getVideos().pipe(
      map(videosMap => Array.from(videosMap.values()))
    );
    this._loadVideos();
  }

  ngAfterViewInit() {
    this._stripesHandler.stopMoving();
  }

  @HostListener('window:scroll') async onScroll() {
    if (!this._canQueryMoreVideos) return;
    this._videosService.isLoading().subscribe(loading => {
      if (loading) return;
      const scrolled = window.scrollY + window.innerHeight;
      const { top } = this._scrollPoint.nativeElement.getBoundingClientRect();
      if (scrolled >= top) {
        this._loadVideos();
      }
    }).unsubscribe();
  }

  loadMore() {
    this._loadVideos();
  }

  goToVideo(video: Video) {
    this.transition = video.id;
    this._stripesHandler.startMoving();
    this._changeDetector.markForCheck();
    setTimeout(() => {
      this._router.navigate([video.id]);
    }, 500);
  }

  idTracker(video) {
    return video.id;
  }

  _loadVideos() {
    const options = {
      pageToken: this._nextPageToken,
      maxResults: environment.videos.defaultMaxResults
    };
    this._videosService.loadVideos(options).subscribe(
      token => {
        if (token) {
          this._nextPageToken = token;
        } else {
          this._canQueryMoreVideos = false;
        }
      },
      err => console.warn(err)
    );
  }

}
