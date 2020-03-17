import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtFloatingButtonPageComponent } from './ngt-floating-button-page.component';

describe('NgtFloatingButtonPageComponent', () => {
  let component: NgtFloatingButtonPageComponent;
  let fixture: ComponentFixture<NgtFloatingButtonPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtFloatingButtonPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtFloatingButtonPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
