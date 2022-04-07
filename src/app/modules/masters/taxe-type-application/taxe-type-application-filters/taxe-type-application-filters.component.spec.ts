import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaxeTypeApplicationFiltersComponent } from './taxe-type-application-filters.component';


describe('TaxeTypeApplicationFiltersComponent', () => {
  let component: TaxeTypeApplicationFiltersComponent;
  let fixture: ComponentFixture<TaxeTypeApplicationFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxeTypeApplicationFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxeTypeApplicationFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
