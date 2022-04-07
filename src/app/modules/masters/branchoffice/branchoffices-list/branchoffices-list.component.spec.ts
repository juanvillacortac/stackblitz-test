import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchofficesListComponent } from './branchoffices-list.component';

describe('BranchofficesListComponent', () => {
  let component: BranchofficesListComponent;
  let fixture: ComponentFixture<BranchofficesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchofficesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchofficesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
