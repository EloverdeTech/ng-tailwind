import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtTbodyComponent } from './ngt-tbody.component';

describe('NgtTbodyComponent', () => {
  let component: NgtTbodyComponent;
  let fixture: ComponentFixture<NgtTbodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtTbodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtTbodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
