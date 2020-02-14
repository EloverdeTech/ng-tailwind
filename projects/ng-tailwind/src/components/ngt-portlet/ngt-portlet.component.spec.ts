import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtPortletComponent } from './ngt-portlet.component';

describe('NgtPortletComponent', () => {
  let component: NgtPortletComponent;
  let fixture: ComponentFixture<NgtPortletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtPortletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtPortletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
