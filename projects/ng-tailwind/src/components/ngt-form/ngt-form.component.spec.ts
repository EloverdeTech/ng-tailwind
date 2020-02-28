import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtFormComponent } from './ngt-form.component';

describe('NgtFormComponent', () => {
  let component: NgtFormComponent;
  let fixture: ComponentFixture<NgtFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
