import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount = 0;
  constructor(private spinner: NgxSpinnerService) { }

  Busy(): void {
    this.busyRequestCount++;
    this.spinner.show(undefined, {
      type: 'pacman',
      size: 'large',
      bdColor: 'rgba(255, 255, 255, 0.7)',
      color: '#333333',
      template: '<img src="https://media.giphy.com/media/o8igknyuKs6aY/giphy.gif"/>'
    });
  }
  Idle(): void {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinner.hide();
    }
  }
}
