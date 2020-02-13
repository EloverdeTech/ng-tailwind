import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtValidationComponent } from './ngt-validation.component';

describe('NgtValidationComponent', () => {
  let component: NgtValidationComponent;
  let fixture: ComponentFixture<NgtValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
