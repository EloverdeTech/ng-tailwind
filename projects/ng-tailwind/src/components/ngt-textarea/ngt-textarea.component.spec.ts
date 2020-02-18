import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtTextareaComponent } from './ngt-textarea.component';

describe('NgtTextareaComponent', () => {
  let component: NgtTextareaComponent;
  let fixture: ComponentFixture<NgtTextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtTextareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
