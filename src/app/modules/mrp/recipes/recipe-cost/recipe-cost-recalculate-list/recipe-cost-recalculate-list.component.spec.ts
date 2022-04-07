import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCostRecalculateListComponent } from './recipe-cost-recalculate-list.component';

describe('RecipeCostRecalculateListComponent', () => {
  let component: RecipeCostRecalculateListComponent;
  let fixture: ComponentFixture<RecipeCostRecalculateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeCostRecalculateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeCostRecalculateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
