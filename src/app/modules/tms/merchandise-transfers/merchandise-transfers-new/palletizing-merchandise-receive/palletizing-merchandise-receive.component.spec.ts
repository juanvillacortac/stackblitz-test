import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalletizingMerchandiseReceiveComponent } from './palletizing-merchandise-receive.component';

describe('PalletizingMerchandiseReceiveComponent', () => {
  let component: PalletizingMerchandiseReceiveComponent;
  let fixture: ComponentFixture<PalletizingMerchandiseReceiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PalletizingMerchandiseReceiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PalletizingMerchandiseReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
