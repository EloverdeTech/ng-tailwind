import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtDropzonePageComponent } from './ngt-dropzone-page.component';

describe('NgtDropzonePageComponent', () => {
  let component: NgtDropzonePageComponent;
  let fixture: ComponentFixture<NgtDropzonePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtDropzonePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtDropzonePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
