import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseRequestSelectionModalComponent } from './merchandise-request-selection-modal.component';

describe('MerchandiseRequestSelectionModalComponent', () => {
  let component: MerchandiseRequestSelectionModalComponent;
  let fixture: ComponentFixture<MerchandiseRequestSelectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchandiseRequestSelectionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandiseRequestSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
