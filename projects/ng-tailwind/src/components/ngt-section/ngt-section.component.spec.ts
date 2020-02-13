import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtSectionComponent } from './ngt-section.component';

describe('NgtSectionComponent', () => {
  let component: NgtSectionComponent;
  let fixture: ComponentFixture<NgtSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
