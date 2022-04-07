import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionFilterComponent } from './description-filter.component';

describe('DescriptionFilterComponent', () => {
  let component: DescriptionFilterComponent;
  let fixture: ComponentFixture<DescriptionFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptionFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
