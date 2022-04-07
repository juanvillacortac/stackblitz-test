import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseRequestListComponent } from './merchandise-request-list.component';

describe('MerchandiseRequestListComponent', () => {
  let component: MerchandiseRequestListComponent;
  let fixture: ComponentFixture<MerchandiseRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchandiseRequestListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandiseRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
