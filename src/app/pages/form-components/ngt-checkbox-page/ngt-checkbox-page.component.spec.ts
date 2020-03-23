import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtCheckboxPageComponent } from './ngt-checkbox-page.component';

describe('NgtCheckboxPageComponent', () => {
  let component: NgtCheckboxPageComponent;
  let fixture: ComponentFixture<NgtCheckboxPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtCheckboxPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtCheckboxPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
