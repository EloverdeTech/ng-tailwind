import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtDateComponent } from './ngt-date.component';

describe('NgtDateComponent', () => {
  let component: NgtDateComponent;
  let fixture: ComponentFixture<NgtDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
