import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class SpinnerService {

  spinnner$: Subject<boolean> = new Subject<boolean>();
  constructor() {}

  showSpinner() {
    this.spinnner$.next(true);
  }

  hideSpinner(){
    this.spinnner$.next(false);
  }
}
