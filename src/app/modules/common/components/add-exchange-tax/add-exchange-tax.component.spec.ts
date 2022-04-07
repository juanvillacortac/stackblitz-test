import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExchangeTaxComponent } from './add-exchange-tax.component';

describe('AddExchangeTaxComponent', () => {
  let component: AddExchangeTaxComponent;
  let fixture: ComponentFixture<AddExchangeTaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExchangeTaxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExchangeTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
