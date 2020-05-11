import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtDatatablePageComponent } from './ngt-datatable-page.component';

describe('NgtDatatablePageComponent', () => {
  let component: NgtDatatablePageComponent;
  let fixture: ComponentFixture<NgtDatatablePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtDatatablePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtDatatablePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
