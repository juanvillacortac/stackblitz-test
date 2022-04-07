import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchofficeModalComponent } from './branchoffice-modal.component';

describe('BranchofficeModalComponent', () => {
  let component: BranchofficeModalComponent;
  let fixture: ComponentFixture<BranchofficeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchofficeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchofficeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
