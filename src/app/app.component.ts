import { Component, OnInit } from '@angular/core';
import { StripesHandlerService } from './services/stripes-handler.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  stripesOffset$: Observable<number>;

  constructor(private _stripesHandler: StripesHandlerService) { }

  ngOnInit() {
    this.stripesOffset$ = this._stripesHandler.offset;
  }

}
