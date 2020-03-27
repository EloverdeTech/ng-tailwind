import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtFormPageComponent } from './ngt-form-page.component';

describe('NgtFormPageComponent', () => {
  let component: NgtFormPageComponent;
  let fixture: ComponentFixture<NgtFormPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtFormPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
