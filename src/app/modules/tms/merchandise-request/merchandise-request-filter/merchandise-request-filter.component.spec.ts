import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseRequestFilterComponent } from './merchandise-request-filter.component';

describe('MerchandiseRequestFilterComponent', () => {
  let component: MerchandiseRequestFilterComponent;
  let fixture: ComponentFixture<MerchandiseRequestFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchandiseRequestFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandiseRequestFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
