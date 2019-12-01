import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StripesHandlerService {

  private _offset = new BehaviorSubject(0);
  private _intervalHandler = null;
  private _moving = false;

  get offset() {
    return this._offset.asObservable();
  };

  constructor() { }

  startMoving(forward = true) {
    if (this._moving) return;
    this._moving = true;
    this._intervalHandler = setInterval(() => {
      this._offset.next(this._offset.value + (2 * (forward ? 1 : -1)));
    }, 25);
  }

  stopMoving() {
    if (this._intervalHandler) {
      this._moving = false;
      clearInterval(this._intervalHandler);
    }
  }

}
