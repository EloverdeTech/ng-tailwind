import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtModalComponent } from './ngt-modal.component';

describe('NgtModalComponent', () => {
  let component: NgtModalComponent;
  let fixture: ComponentFixture<NgtModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
