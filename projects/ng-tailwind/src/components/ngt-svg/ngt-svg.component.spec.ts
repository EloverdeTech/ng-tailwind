import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtSvgComponent } from './ngt-svg.component';

describe('NgtSvgComponent', () => {
  let component: NgtSvgComponent;
  let fixture: ComponentFixture<NgtSvgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtSvgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
