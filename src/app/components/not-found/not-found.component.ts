import { Component, OnInit } from '@angular/core';
import {from, of} from 'rxjs';
import {concatMap, delay} from 'rxjs/operators';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  userMsg = 'Sorry, this page does not exist (((';
  outputMsg: string = '';
  showMobileView: boolean = false;
  showLaptopView: boolean = false;


  constructor(breakpointObserver: BreakpointObserver) {

    breakpointObserver.observe(['(max-width: 768px)']).subscribe(result => {
      console.log(result);
      if (result.matches){
        this.showLaptopView = false;
        this.showMobileView = true;
      }else {
        this.showLaptopView = true;
        this.showMobileView = false;
      }
    })
  }


  ngOnInit(): void {
    from(this.userMsg)
      .pipe(
          concatMap(ch => of(ch).pipe(delay(200)))
      ).subscribe(character => {
         this.outputMsg = this.outputMsg.replace(/[|]/g, '');
         this.outputMsg += character +'|';
    },null, () => {
        this.outputMsg = this.outputMsg.substr(0, this.outputMsg.length - 1)
    })
  }

  get getImg(): string{
    return `url("https://image.freepik.com/free-vector/glitch-error-404-page-background_23-2148086227.jpg") center/cover no-repeat`
  }

}
