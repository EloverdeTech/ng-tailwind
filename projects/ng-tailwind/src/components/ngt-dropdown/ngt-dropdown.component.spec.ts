import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtDropdownComponent } from './ngt-dropdown.component';

describe('NgtDropdownComponent', () => {
  let component: NgtDropdownComponent;
  let fixture: ComponentFixture<NgtDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
