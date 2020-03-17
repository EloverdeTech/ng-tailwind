import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtActionPageComponent } from './ngt-action-page.component';

describe('NgtAction.PageComponent', () => {
  let component: NgtActionPageComponent;
  let fixture: ComponentFixture<NgtActionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgtActionPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtActionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
