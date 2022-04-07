import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CdTimerComponent } from 'angular-cd-timer';
import * as moment from 'moment';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-timer-viewer',
  templateUrl: './timer-viewer.component.html',
  styleUrls: ['./timer-viewer.component.scss']
})
export class TimerViewerComponent implements OnInit, OnDestroy {

  @Input() title = '';
  @Input() startDate: Date;
  @Input() finalizedDate: Date;

  @ViewChild('basicTimer', { static: false }) cdTimer: CdTimerComponent;

  time = 0;
  timeElapsed = 0;

  subscription: Subscription;

  constructor() { 

  }
  ngOnDestroy(): void {
    this.stopTimer();
  }

  ngOnInit(): void {
    this.setTime();
  }

  getTime() {
    const duration = moment.duration(this.time, 'seconds');
    const timeString = moment.utc(duration.asMilliseconds()).format('HH:mm:ss');

    return timeString;
  }

 setTime() {
    if (this.startDate) {
      if(this.finalizedDate) {
        this.setSeconds();
      } else {
        this.setElapsedSeconds();
        this.startTimer();
      }
    } 
  }

  private setElapsedSeconds() {

    const startMoment = moment(this.startDate);
    const actualDate = moment(Date());

    this.timeElapsed = moment.duration(actualDate.diff(startMoment)).asSeconds();


    this.timeElapsed = this.timeElapsed < 0 ? 0 : this.timeElapsed;
  }


  private setSeconds() {
    debugger
    const startMoment = moment(this.startDate);
    const finishTime = moment(this.finalizedDate);

    this.time = moment.duration(finishTime.diff(startMoment)).asSeconds();
  
  }

  private startTimer(){
    if(this.startDate) {
      const source = timer(this.startDate, 1000);
      this.subscription = source.subscribe(val => {
         this.time = this.timeElapsed + val;
      });
    }
  }

  private stopTimer(){
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
