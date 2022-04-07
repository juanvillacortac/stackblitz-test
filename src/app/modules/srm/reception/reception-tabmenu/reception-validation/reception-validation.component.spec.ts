import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionValidationComponent } from './reception-validation.component';

describe('ReceptionValidationComponent', () => {
  let component: ReceptionValidationComponent;
  let fixture: ComponentFixture<ReceptionValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceptionValidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
