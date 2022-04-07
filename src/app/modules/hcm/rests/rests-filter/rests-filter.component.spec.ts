import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestsFilterComponent } from './rests-filter.component';

describe('RestsFilterComponent', () => {
  let component: RestsFilterComponent;
  let fixture: ComponentFixture<RestsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestsFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
