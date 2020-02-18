import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtCheckboxComponent } from './ngt-checkbox.component';

describe('NgtCheckboxComponent', () => {
  let component: NgtCheckboxComponent;
  let fixture: ComponentFixture<NgtCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
