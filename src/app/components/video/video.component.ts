import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Video } from 'src/app/services/videos.service';

@Component({
  selector: 'mp-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoComponent {

  @Input() video: Video;

  @Output() videoLoaded = new EventEmitter<void>();

  ready = false;
  url = null;
  placeholder = null;

  constructor(
    private _domSanitizer: DomSanitizer,
    private _changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.placeholder = this.video.thumbnails[this.video.thumbnails.length - 1].url;
    this.url = this._domSanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.video.id}`);
  }

  videoReady() {
    this.ready = true;
    this.videoLoaded.emit();
    this._changeDetector.markForCheck();
  }

}
