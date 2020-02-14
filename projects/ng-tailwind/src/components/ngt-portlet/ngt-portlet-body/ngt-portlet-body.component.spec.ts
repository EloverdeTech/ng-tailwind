import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtPortletBodyComponent } from './ngt-portlet-body.component';

describe('NgtPortletBodyComponent', () => {
  let component: NgtPortletBodyComponent;
  let fixture: ComponentFixture<NgtPortletBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtPortletBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtPortletBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
