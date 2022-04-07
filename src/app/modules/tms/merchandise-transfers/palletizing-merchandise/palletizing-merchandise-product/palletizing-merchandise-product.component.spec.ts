import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalletizingMerchandiseProductComponent } from './palletizing-merchandise-product.component';

describe('PalletizingMerchandiseProductComponent', () => {
  let component: PalletizingMerchandiseProductComponent;
  let fixture: ComponentFixture<PalletizingMerchandiseProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PalletizingMerchandiseProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PalletizingMerchandiseProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
