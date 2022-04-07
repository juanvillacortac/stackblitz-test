import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

export type LoadingStatus = {
  loading: boolean;
  message: string;
};

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  loading = false;
  message = "";
  loadingStatus: Subject<LoadingStatus> = new Subject();

  startLoading(message = "wait_loading") {
    this.message = message;
    this.loading = true;
    this.loadingStatus.next({ loading: true, message: message });
  }

  stopLoading() {
    this.message = "";
    this.loading = false;
    this.loadingStatus.next({ loading: false, message: "" });
  }
}
