import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchTransfersListModalComponent } from './branch-transfers-list-modal.component';

describe('BranchTransfersListModalComponent', () => {
  let component: BranchTransfersListModalComponent;
  let fixture: ComponentFixture<BranchTransfersListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchTransfersListModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchTransfersListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
