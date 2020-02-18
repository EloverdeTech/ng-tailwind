import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtDropdownContainerComponent } from './ngt-dropdown-container.component';

describe('NgtDropdownContainerComponent', () => {
  let component: NgtDropdownContainerComponent;
  let fixture: ComponentFixture<NgtDropdownContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtDropdownContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtDropdownContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
