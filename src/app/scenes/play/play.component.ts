import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { VideosService, Video } from 'src/app/services/videos.service';
import { StripesHandlerService } from 'src/app/services/stripes-handler.service';

@Component({
  selector: 'mp-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayComponent implements OnInit, AfterViewInit {

  video$: Observable<Video>;
  ready = false;
  leaving = false;

  constructor(
    private _router: Router,
    private _changeDetector: ChangeDetectorRef,
    private _videosService: VideosService,
    private _stripesHandler: StripesHandlerService
  ) { }

  ngOnInit() {
    const videoId = this._router.routerState.snapshot.url.slice(1);
    this.video$ = this._videosService.getVideo(videoId);
  }

  ngAfterViewInit() {
    this._stripesHandler.startMoving();
    setTimeout(() => {
      this.ready = true;
      this._changeDetector.markForCheck();
    }, 0);
  }

  goToList() {
    this.leaving = true;
    this._stripesHandler.startMoving(false);
    this._changeDetector.markForCheck();
    setTimeout(() => {
      this._router.navigate(['']);
    }, 250);
  }

  videoReady() {
    this._stripesHandler.stopMoving();
  }

}
