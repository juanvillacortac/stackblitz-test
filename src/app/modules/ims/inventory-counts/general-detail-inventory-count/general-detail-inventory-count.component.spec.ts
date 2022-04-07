import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralDetailInventoryCountComponent } from './general-detail-inventory-count.component';

describe('GeneralDetailInventoryCountComponent', () => {
  let component: GeneralDetailInventoryCountComponent;
  let fixture: ComponentFixture<GeneralDetailInventoryCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralDetailInventoryCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralDetailInventoryCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
