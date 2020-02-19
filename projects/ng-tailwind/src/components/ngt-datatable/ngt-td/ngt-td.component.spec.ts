import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtTdComponent } from './ngt-td.component';

describe('NgtTdComponent', () => {
  let component: NgtTdComponent;
  let fixture: ComponentFixture<NgtTdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtTdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtTdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
