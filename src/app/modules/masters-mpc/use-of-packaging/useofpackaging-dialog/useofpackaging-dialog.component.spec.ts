import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseofpackagingDialogComponent } from './useofpackaging-dialog.component';

describe('UseofpackagingDialogComponent', () => {
  let component: UseofpackagingDialogComponent;
  let fixture: ComponentFixture<UseofpackagingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UseofpackagingDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseofpackagingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
