import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributedProductPanelComponent } from './distributed-product-panel.component';

describe('DistributedProductPanelComponent', () => {
  let component: DistributedProductPanelComponent;
  let fixture: ComponentFixture<DistributedProductPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistributedProductPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributedProductPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
