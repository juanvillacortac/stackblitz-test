import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseTransfersListComponent } from './merchandise-transfers-list.component';

describe('MerchandiseTransfersListComponent', () => {
  let component: MerchandiseTransfersListComponent;
  let fixture: ComponentFixture<MerchandiseTransfersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchandiseTransfersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandiseTransfersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
