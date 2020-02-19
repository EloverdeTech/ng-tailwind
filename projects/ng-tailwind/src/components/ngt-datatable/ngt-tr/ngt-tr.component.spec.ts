import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtTrComponent } from './ngt-tr.component';

describe('NgtTrComponent', () => {
  let component: NgtTrComponent;
  let fixture: ComponentFixture<NgtTrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtTrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtTrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
