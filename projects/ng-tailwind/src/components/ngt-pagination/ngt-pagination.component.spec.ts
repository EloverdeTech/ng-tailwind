import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtPaginationComponent } from './ngt-pagination.component';

describe('NgtPaginationComponent', () => {
  let component: NgtPaginationComponent;
  let fixture: ComponentFixture<NgtPaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtPaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
