import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandFiltersPanelComponent } from './brand-filters-panel.component';

describe('BrandFiltersPanelComponent', () => {
  let component: BrandFiltersPanelComponent;
  let fixture: ComponentFixture<BrandFiltersPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandFiltersPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandFiltersPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
