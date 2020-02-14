import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtButtonComponent } from './ngt-button.component';

describe('NgtButtonComponent', () => {
  let component: NgtButtonComponent;
  let fixture: ComponentFixture<NgtButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
