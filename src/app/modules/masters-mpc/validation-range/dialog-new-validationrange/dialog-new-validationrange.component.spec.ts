import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewValidationrangeComponent } from './dialog-new-validationrange.component';

describe('DialogNewValidationrangeComponent', () => {
  let component: DialogNewValidationrangeComponent;
  let fixture: ComponentFixture<DialogNewValidationrangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNewValidationrangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNewValidationrangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
