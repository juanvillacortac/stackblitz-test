import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertTypeFilterComponent } from './insert-type-filter.component';

describe('InsertTypeFilterComponent', () => {
  let component: InsertTypeFilterComponent;
  let fixture: ComponentFixture<InsertTypeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertTypeFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertTypeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
