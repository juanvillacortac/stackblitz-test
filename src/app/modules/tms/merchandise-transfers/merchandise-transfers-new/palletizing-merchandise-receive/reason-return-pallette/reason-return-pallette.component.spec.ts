import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonReturnPalletteComponent } from './reason-return-pallette.component';

describe('ReasonReturnPalletteComponent', () => {
  let component: ReasonReturnPalletteComponent;
  let fixture: ComponentFixture<ReasonReturnPalletteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasonReturnPalletteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonReturnPalletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
