import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseRequestProductComponent } from './merchandise-request-product.component';

describe('MerchandiseRequestProductComponent', () => {
  let component: MerchandiseRequestProductComponent;
  let fixture: ComponentFixture<MerchandiseRequestProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchandiseRequestProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandiseRequestProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
