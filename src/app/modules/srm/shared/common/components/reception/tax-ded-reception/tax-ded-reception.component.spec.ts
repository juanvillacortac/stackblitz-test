import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxDedReceptionComponent } from './tax-ded-reception.component';

describe('TaxDedReceptionComponent', () => {
  let component: TaxDedReceptionComponent;
  let fixture: ComponentFixture<TaxDedReceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxDedReceptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxDedReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
