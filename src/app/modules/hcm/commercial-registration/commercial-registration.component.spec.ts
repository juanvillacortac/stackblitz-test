import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialRegistrationComponent } from './commercial-registration.component';

describe('CommercialRegistrationComponent', () => {
  let component: CommercialRegistrationComponent;
  let fixture: ComponentFixture<CommercialRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommercialRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercialRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
