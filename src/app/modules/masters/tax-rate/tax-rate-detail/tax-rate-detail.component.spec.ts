import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaxRateDetailComponent } from './tax-rate-detail.component';


describe('TaxRateDetailComponent', () => {
  let component: TaxRateDetailComponent;
  let fixture: ComponentFixture<TaxRateDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxRateDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxRateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
