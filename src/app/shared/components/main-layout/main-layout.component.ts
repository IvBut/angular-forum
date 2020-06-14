import {Component, OnDestroy, OnInit} from '@angular/core';
import {SpinnerService} from '../../../services/spinner.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  showSpinner: boolean = false;
  spSub: Subscription;

  constructor(public spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.spSub = this.spinnerService.spinnner$.subscribe(value => {
        this.showSpinner = value === true;
    })
  }

  ngOnDestroy(): void {
    if (this.spSub) {
      this.spSub.unsubscribe();
    }
  }
}
