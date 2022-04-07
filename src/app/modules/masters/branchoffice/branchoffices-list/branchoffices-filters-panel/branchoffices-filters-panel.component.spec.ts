import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchofficesFiltersPanelComponent } from './branchoffices-filters-panel.component';

describe('BranchofficesFiltersPanelComponent', () => {
  let component: BranchofficesFiltersPanelComponent;
  let fixture: ComponentFixture<BranchofficesFiltersPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchofficesFiltersPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchofficesFiltersPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
