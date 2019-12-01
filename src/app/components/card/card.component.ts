import { Component, Input, ChangeDetectionStrategy, OnInit, OnChanges, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Video } from 'src/app/services/videos.service';

@Component({
  selector: 'mp-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent implements OnInit, OnChanges {

  @Input() video: Video;
  @Input() transition: string;

  transitionStyle = null;
  biggestThumbnail: string;

  constructor(
    private _elementRef: ElementRef,
    private _domSanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.biggestThumbnail = this.video.thumbnails[this.video.thumbnails.length - 1].url;
  }

  ngOnChanges() {
    // Dear reviwers: please close your eyes now...

    // TODO: create config.scss with global spacing and layout sizing values,
    // expose them with :export and read them where needed in js
    // Also move this to a separate method.

    if (this.transition && this.transition === this.video.id) {
      const { x, y } = this._elementRef.nativeElement.getBoundingClientRect();
      const targetX = window.innerWidth * .058;
      const targetY = 90;
      const targetWidth = window.innerWidth > 870
        ? window.innerWidth * .584
        : window.innerWidth - (window.innerWidth * .058 * 2);
      const targetHeight = window.innerWidth > 870
        ? window.innerWidth * .327
        : window.innerWidth * .5;
      const deltaX = targetX - x;
      const deltaY = targetY - y;
      const style = `
        transform: translate(${deltaX}px, ${deltaY}px);
        width: ${targetWidth}px;
        height: ${targetHeight}px;
      `;
      this.transitionStyle = this._domSanitizer.bypassSecurityTrustStyle(style);
    }
    // ...ok you can open your eyes :)
  }

}
