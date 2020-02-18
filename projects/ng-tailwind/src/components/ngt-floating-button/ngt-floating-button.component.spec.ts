import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtFloatingButtonComponent } from './ngt-floating-button.component';

describe('NgtFloatingButtonComponent', () => {
  let component: NgtFloatingButtonComponent;
  let fixture: ComponentFixture<NgtFloatingButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtFloatingButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtFloatingButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
