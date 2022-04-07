import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseTransfersNewComponent } from './merchandise-transfers-new.component';

describe('MerchandiseTransfersNewComponent', () => {
  let component: MerchandiseTransfersNewComponent;
  let fixture: ComponentFixture<MerchandiseTransfersNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchandiseTransfersNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandiseTransfersNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
