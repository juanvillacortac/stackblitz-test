import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MotivesTypeFiltersComponent } from './motives-type-filters.component';


describe('MotivesTypeFiltersComponent', () => {
  let component: MotivesTypeFiltersComponent;
  let fixture: ComponentFixture<MotivesTypeFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotivesTypeFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivesTypeFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
