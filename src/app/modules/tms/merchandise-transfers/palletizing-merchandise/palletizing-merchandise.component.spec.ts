import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalletizingMerchandiseComponent } from './palletizing-merchandise.component';

describe('PalletizingMerchandiseComponent', () => {
  let component: PalletizingMerchandiseComponent;
  let fixture: ComponentFixture<PalletizingMerchandiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PalletizingMerchandiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PalletizingMerchandiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
