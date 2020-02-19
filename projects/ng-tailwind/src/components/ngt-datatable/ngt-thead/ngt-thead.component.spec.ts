import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtTheadComponent } from './ngt-thead.component';

describe('NgtTheadComponent', () => {
  let component: NgtTheadComponent;
  let fixture: ComponentFixture<NgtTheadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtTheadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtTheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
