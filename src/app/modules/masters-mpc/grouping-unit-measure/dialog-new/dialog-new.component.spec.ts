import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewComponentGroupingUnitMeasure } from './dialog-new.component';

describe('DialogNewComponent', () => {
  let component: DialogNewComponentGroupingUnitMeasure;
  let fixture: ComponentFixture<DialogNewComponentGroupingUnitMeasure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogNewComponentGroupingUnitMeasure ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNewComponentGroupingUnitMeasure);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
