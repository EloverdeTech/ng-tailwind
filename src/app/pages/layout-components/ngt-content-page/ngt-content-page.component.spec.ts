import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtContentPageComponent } from './ngt-content-page.component';

describe('NgtContentPageComponent', () => {
  let component: NgtContentPageComponent;
  let fixture: ComponentFixture<NgtContentPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtContentPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtContentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
