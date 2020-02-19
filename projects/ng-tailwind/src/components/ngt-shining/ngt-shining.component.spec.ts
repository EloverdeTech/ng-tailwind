import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtShiningComponent } from './ngt-shining.component';

describe('NgtShiningComponent', () => {
  let component: NgtShiningComponent;
  let fixture: ComponentFixture<NgtShiningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtShiningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtShiningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
