import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MotiveFiltersComponent } from './motive-filters.component';

describe('MotiveFiltersComponent', () => {
  let component: MotiveFiltersComponent;
  let fixture: ComponentFixture<MotiveFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotiveFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotiveFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
