import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtDatePageComponent } from './ngt-date-page.component';

describe('NgtDatePageComponent', () => {
  let component: NgtDatePageComponent;
  let fixture: ComponentFixture<NgtDatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtDatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtDatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
