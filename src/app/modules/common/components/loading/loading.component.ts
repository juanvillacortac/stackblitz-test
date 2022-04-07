import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from './shared/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit, OnDestroy {

  @Input() initLoading: boolean;
  @Input() initMessage: string;

  loading = false;
  message = '';
  loadingSubscription: Subscription;

  constructor(private loadingService: LoadingService) { }

  ngOnInit() {
    this.loading = this.initLoading;
    this.message = this.initMessage;

    this.loadingSubscription = this.loadingService.loadingStatus.subscribe({
      next: this.handleUpdateResponse.bind(this),
      error: this.handleError.bind(this)
   });
  }

  handleUpdateResponse(result) {
    this.loading = result.loading;
    this.message = result.message;
  }

  handleError(error) {
    console.log(error);
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }
}
