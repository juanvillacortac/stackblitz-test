import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DedheaderPurchaseComponent } from './dedheader-purchase.component';

describe('DedheaderPurchaseComponent', () => {
  let component: DedheaderPurchaseComponent;
  let fixture: ComponentFixture<DedheaderPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DedheaderPurchaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DedheaderPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
