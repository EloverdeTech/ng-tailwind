import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgtStylizableTemplateComponent } from './ngt-stylizable-template.component';

describe('NgtStylizableTemplateComponent', () => {
  let component: NgtStylizableTemplateComponent;
  let fixture: ComponentFixture<NgtStylizableTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgtStylizableTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgtStylizableTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
