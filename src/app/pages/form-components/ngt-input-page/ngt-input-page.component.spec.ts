import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtInputPageComponent } from './ngt-input-page.component';

describe('NgtInputPageComponent', () => {
  let component: NgtInputPageComponent;
  let fixture: ComponentFixture<NgtInputPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtInputPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtInputPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
