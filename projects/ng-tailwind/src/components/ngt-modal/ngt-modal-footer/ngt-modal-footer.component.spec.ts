import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtModalFooterComponent } from './ngt-modal-footer.component';

describe('NgtModalFooterComponent', () => {
  let component: NgtModalFooterComponent;
  let fixture: ComponentFixture<NgtModalFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtModalFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtModalFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
