import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsignmentIvoiceListComponent } from './consignment-ivoice-list.component';

describe('ConsignmentIvoiceListComponent', () => {
  let component: ConsignmentIvoiceListComponent;
  let fixture: ComponentFixture<ConsignmentIvoiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsignmentIvoiceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsignmentIvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
