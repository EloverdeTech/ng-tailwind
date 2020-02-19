import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtThCheckComponent } from './ngt-th-check.component';

describe('NgtThCheckComponent', () => {
  let component: NgtThCheckComponent;
  let fixture: ComponentFixture<NgtThCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtThCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtThCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
