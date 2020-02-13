import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgtHeaderNavComponent } from './ngt-header-nav.component';

describe('NgtHeaderNavComponent', () => {
  let component: NgtHeaderNavComponent;
  let fixture: ComponentFixture<NgtHeaderNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtHeaderNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtHeaderNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
