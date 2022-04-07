import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseTransferProductReceiveComponent } from './merchandise-transfer-product-receive.component';

describe('MerchandiseTransferProductReceiveComponent', () => {
  let component: MerchandiseTransferProductReceiveComponent;
  let fixture: ComponentFixture<MerchandiseTransferProductReceiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchandiseTransferProductReceiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandiseTransferProductReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
