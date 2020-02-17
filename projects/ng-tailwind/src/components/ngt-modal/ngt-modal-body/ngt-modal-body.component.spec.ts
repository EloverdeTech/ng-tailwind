import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtModalBodyComponent } from './ngt-modal-body.component';

describe('NgtModalBodyComponent', () => {
  let component: NgtModalBodyComponent;
  let fixture: ComponentFixture<NgtModalBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtModalBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtModalBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
