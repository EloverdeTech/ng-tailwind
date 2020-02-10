import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtSidenavComponent } from './ngt-sidenav.component';

describe('NgtSidenavComponent', () => {
  let component: NgtSidenavComponent;
  let fixture: ComponentFixture<NgtSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
