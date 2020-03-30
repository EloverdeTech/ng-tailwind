import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtTextareaPageComponent } from './ngt-textarea-page.component';

describe('NgtTextareaPageComponent', () => {
  let component: NgtTextareaPageComponent;
  let fixture: ComponentFixture<NgtTextareaPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtTextareaPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtTextareaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
