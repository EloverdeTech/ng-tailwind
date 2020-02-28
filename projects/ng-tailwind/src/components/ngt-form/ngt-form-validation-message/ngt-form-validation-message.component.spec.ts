import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtFormValidationMessageComponent } from './ngt-form-validation-message.component';

describe('NgtFormValidationMessageComponent', () => {
  let component: NgtFormValidationMessageComponent;
  let fixture: ComponentFixture<NgtFormValidationMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtFormValidationMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtFormValidationMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
