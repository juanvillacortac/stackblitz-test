import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseTransfersFilterComponent } from './merchandise-transfers-filter.component';

describe('MerchandiseTransfersFilterComponent', () => {
  let component: MerchandiseTransfersFilterComponent;
  let fixture: ComponentFixture<MerchandiseTransfersFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchandiseTransfersFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandiseTransfersFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
