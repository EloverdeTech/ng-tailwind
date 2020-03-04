import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtDropzoneComponent } from './ngt-dropzone.component';

describe('NgtDropzoneComponent', () => {
  let component: NgtDropzoneComponent;
  let fixture: ComponentFixture<NgtDropzoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtDropzoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtDropzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
