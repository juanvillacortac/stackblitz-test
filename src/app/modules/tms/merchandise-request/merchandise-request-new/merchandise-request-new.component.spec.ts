import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchandiseRequestNewComponent } from './merchandise-request-new.component';

describe('MerchandiseRequestNewComponent', () => {
  let component: MerchandiseRequestNewComponent;
  let fixture: ComponentFixture<MerchandiseRequestNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchandiseRequestNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchandiseRequestNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
