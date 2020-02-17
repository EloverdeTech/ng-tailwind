import { Component, ViewChild } from '@angular/core';
import { NgtModalComponent } from 'projects/ng-tailwind/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'lib-test';

  @ViewChild('ngtModal', { static: true }) ngtModal: NgtModalComponent;

  openModal() {
    this.ngtModal.open();
  }

  closeModal() {
    this.ngtModal.close();
  }
}