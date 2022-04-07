import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAdjustmentListComponent } from './detail-adjustment-list.component';

describe('DetailAdjustmentListComponent', () => {
  let component: DetailAdjustmentListComponent;
  let fixture: ComponentFixture<DetailAdjustmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailAdjustmentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailAdjustmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
