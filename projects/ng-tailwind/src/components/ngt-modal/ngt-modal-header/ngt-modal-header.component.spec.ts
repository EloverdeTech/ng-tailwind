import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtModalHeaderComponent } from './ngt-modal-header.component';

describe('NgtModalHeaderComponent', () => {
  let component: NgtModalHeaderComponent;
  let fixture: ComponentFixture<NgtModalHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtModalHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtModalHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
