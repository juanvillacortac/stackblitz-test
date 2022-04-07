import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinFiltersPanelComponent } from './coin-filters-panel.component';

describe('CoinFiltersPanelComponent', () => {
  let component: CoinFiltersPanelComponent;
  let fixture: ComponentFixture<CoinFiltersPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinFiltersPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinFiltersPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
