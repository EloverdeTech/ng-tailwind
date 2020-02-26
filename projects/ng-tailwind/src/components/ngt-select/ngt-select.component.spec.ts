import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtSelectComponent } from './ngt-select.component';

describe('NgtSelectComponent', () => {
  let component: NgtSelectComponent;
  let fixture: ComponentFixture<NgtSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
