import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductorigintypePanelComponent } from './productorigintype-panel.component';

describe('ProductorigintypePanelComponent', () => {
  let component: ProductorigintypePanelComponent;
  let fixture: ComponentFixture<ProductorigintypePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductorigintypePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductorigintypePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
