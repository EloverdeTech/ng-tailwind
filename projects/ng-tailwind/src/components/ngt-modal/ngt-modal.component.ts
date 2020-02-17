import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'ngt-modal',
  templateUrl: './ngt-modal.component.html',
  styleUrls: ['./ngt-modal.component.css'],
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0 })),
      transition(':enter, :leave', [
        animate(300)
      ])
    ])
  ]
})
export class NgtModalComponent implements AfterViewInit {
  @ViewChild('modalContainer', { static: true }) modalContainer: ElementRef
  @Input() customLayout: boolean = false;
  @Input() disableDefaultCloses: boolean = false;

  @Output() onModalClose: EventEmitter<any> = new EventEmitter();

  public closeButton = document.querySelectorAll('.modal-close');
  public isOpen: boolean = false;

  close() {
    this.onModalClose.emit();
    this.isOpen = false;
  }

  open() {
    this.isOpen = true;
  }

  ngAfterViewInit() {
    if (!this.disableDefaultCloses) {
      this.modalContainer.nativeElement.onkeydown = (event: any) => {
        if (event.keyCode == 27) {
          this.close();
        }
      }
    }
  }
}
