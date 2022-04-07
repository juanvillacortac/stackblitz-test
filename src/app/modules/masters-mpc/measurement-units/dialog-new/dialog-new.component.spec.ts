import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewComponentMU } from './dialog-new.component';

describe('DialogNewComponent', () => {
  let component: DialogNewComponentMU;
  let fixture: ComponentFixture<DialogNewComponentMU>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNewComponentMU ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNewComponentMU);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
