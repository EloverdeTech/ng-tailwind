import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtPortletFooterComponent } from './ngt-portlet-footer.component';

describe('NgtPortletFooterComponent', () => {
  let component: NgtPortletFooterComponent;
  let fixture: ComponentFixture<NgtPortletFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtPortletFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtPortletFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
