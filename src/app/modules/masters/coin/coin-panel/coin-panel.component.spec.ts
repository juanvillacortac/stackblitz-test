import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinPanelComponent } from './coin-panel.component';

describe('CoinPanelComponent', () => {
  let component: CoinPanelComponent;
  let fixture: ComponentFixture<CoinPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
