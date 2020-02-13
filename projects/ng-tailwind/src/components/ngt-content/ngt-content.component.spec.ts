import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtContentComponent } from './ngt-content.component';

describe('NgtContentComponent', () => {
  let component: NgtContentComponent;
  let fixture: ComponentFixture<NgtContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
