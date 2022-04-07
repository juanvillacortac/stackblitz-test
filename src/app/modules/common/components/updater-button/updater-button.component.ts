import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { UpdaterButtonService } from './service/updater-button.service';
import { milliseconds } from 'date-fns';

@Component({
  selector: 'app-updater-button',
  templateUrl: './updater-button.component.html',
  styleUrls: ['./updater-button.component.scss']
})
export class UpdaterButtonComponent implements OnInit, OnDestroy {

  label: string = 'update';
  items: MenuItem[];

  eventInit: boolean = false;

  @Output() updateMethod = new EventEmitter();
  eventFinished: boolean = true;

  icon: string = this.getIconValue();

  subscription: Subscription;
  updaterIsActive: Subscription;

  milliSecondsSelected = 0;

  constructor(private readonly updaterButtonService: UpdaterButtonService) { }

  ngOnInit(): void {

    this.updaterIsActive = this.updaterButtonService.updaterIsActive.subscribe(res => {
    this.eventFinished = !res;

    if(!res && this.milliSecondsSelected > 0) {
      console.log('teeest');
      this.stopTimer();
      this.startTimer(this.milliSecondsSelected);
    }

    });
    this.setItems();
  }

  update() {
    this.eventFinished = false;
  }

  getIconValue() {
    return  this.eventFinished ? 'pi pi-refresh' : 'pi pi-spin pi-spinner';
  }

  setItems() {
    this.items = [
      {
        label: 'Ahora no', command: () => {
          this.label = 'no_update';
          this.stopTimer();
        }
      },
      {
        label: '5s para actualizar', command: () => {
          this.label = "five_to_update";
          this.startTimer(5000);
        }
      },
      {
        label: '15s para actualizar', command: () => {
          this.label = "fifteen_to_update";
          this.startTimer(15000);
        }
      },
      {
        label: '30s para actualizar', command: () => {
          this.label = "thirty_to_update";
          this.startTimer(30000);
        }
      },
  ];
  }
  
  private startTimer(milliseconds) {
    this.milliSecondsSelected = milliseconds;
    this.stopTimer();
    this.setStopValues();
    const source = timer(new Date(), milliseconds);
    
    this.subscription = source.subscribe((x) => {
      if(this.eventInit) {
        this.eventFinished = false;
        this.icon = this.getIconValue();
        this.updateMethod.emit();
      } else {
        this.eventInit = true;
      }
    });
}

  private stopTimer(){
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private setStopValues() {
    this.eventInit = false;
    this.eventFinished = true;
    this.icon = this.getIconValue();
  }
  
  ngOnDestroy(): void {
    this.stopTimer();
  }

}
