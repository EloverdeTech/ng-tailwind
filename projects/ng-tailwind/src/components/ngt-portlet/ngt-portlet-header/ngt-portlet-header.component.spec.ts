import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtPortletHeaderComponent } from './ngt-portlet-header.component';

describe('NgtPortletHeaderComponent', () => {
  let component: NgtPortletHeaderComponent;
  let fixture: ComponentFixture<NgtPortletHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtPortletHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtPortletHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
