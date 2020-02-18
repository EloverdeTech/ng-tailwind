import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtActionComponent } from './ngt-action.component';

describe('NgtActionComponent', () => {
  let component: NgtActionComponent;
  let fixture: ComponentFixture<NgtActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
