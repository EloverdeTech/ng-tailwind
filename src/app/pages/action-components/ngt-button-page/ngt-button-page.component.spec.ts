import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtButtonPageComponent } from './ngt-button-page.component';

describe('NgtButtonPageComponent', () => {
  let component: NgtButtonPageComponent;
  let fixture: ComponentFixture<NgtButtonPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtButtonPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtButtonPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
