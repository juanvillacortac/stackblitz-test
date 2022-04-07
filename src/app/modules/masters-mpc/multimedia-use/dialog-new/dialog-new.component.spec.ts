import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewComponentMultimediaUse } from './dialog-new.component';

describe('DialogNewComponent', () => {
  let component: DialogNewComponentMultimediaUse;
  let fixture: ComponentFixture<DialogNewComponentMultimediaUse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogNewComponentMultimediaUse ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNewComponentMultimediaUse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
