import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtInputComponent } from './ngt-input.component';

describe('NgtInputComponent', () => {
  let component: NgtInputComponent;
  let fixture: ComponentFixture<NgtInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
