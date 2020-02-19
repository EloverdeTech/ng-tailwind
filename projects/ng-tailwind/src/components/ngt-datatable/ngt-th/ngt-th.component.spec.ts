import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtThComponent } from './ngt-th.component';

describe('NgtThComponent', () => {
  let component: NgtThComponent;
  let fixture: ComponentFixture<NgtThComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtThComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtThComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
