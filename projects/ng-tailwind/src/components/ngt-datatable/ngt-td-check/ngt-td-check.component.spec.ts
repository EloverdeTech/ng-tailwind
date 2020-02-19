import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtTdCheckComponent } from './ngt-td-check.component';

describe('NgtTdCheckComponent', () => {
  let component: NgtTdCheckComponent;
  let fixture: ComponentFixture<NgtTdCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtTdCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtTdCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
