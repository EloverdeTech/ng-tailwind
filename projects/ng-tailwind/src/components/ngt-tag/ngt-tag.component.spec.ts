import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtTagComponent } from './ngt-tag.component';

describe('NgtTagComponent', () => {
  let component: NgtTagComponent;
  let fixture: ComponentFixture<NgtTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
