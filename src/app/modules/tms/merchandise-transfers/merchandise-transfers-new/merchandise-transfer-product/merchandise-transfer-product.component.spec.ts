import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseTransferProductComponent } from './merchandise-transfer-product.component';

describe('MerchandiseTransferProductComponent', () => {
  let component: MerchandiseTransferProductComponent;
  let fixture: ComponentFixture<MerchandiseTransferProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchandiseTransferProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandiseTransferProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
