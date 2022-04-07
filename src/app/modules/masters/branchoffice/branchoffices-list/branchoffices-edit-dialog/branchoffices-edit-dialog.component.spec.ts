import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchofficesEditDialogComponent } from './branchoffices-edit-dialog.component';

describe('BranchofficesEditDialogComponent', () => {
  let component: BranchofficesEditDialogComponent;
  let fixture: ComponentFixture<BranchofficesEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchofficesEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchofficesEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
