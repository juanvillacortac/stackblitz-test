import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMasiveExchangeTaxComponent } from './add-masive-exchange-tax.component';

describe('AddMasiveExchangeTaxComponent', () => {
  let component: AddMasiveExchangeTaxComponent;
  let fixture: ComponentFixture<AddMasiveExchangeTaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMasiveExchangeTaxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMasiveExchangeTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
