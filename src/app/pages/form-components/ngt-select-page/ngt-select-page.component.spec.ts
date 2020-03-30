import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtSelectPageComponent } from './ngt-select-page.component';

describe('NgtSelectPageComponent', () => {
  let component: NgtSelectPageComponent;
  let fixture: ComponentFixture<NgtSelectPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtSelectPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtSelectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
