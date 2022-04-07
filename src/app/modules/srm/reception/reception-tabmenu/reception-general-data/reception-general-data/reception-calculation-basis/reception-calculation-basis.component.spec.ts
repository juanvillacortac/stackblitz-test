import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionCalculationBasisComponent } from './reception-calculation-basis.component';

describe('ReceptionCalculationBasisComponent', () => {
  let component: ReceptionCalculationBasisComponent;
  let fixture: ComponentFixture<ReceptionCalculationBasisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceptionCalculationBasisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionCalculationBasisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
