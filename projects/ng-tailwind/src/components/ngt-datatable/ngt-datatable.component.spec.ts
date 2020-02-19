import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtDatatableComponent } from './ngt-datatable.component';

describe('NgtDatatableComponent', () => {
  let component: NgtDatatableComponent;
  let fixture: ComponentFixture<NgtDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
