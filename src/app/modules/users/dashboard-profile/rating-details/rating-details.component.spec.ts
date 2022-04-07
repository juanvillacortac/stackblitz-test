import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingDetailsComponent } from './rating-details.component';

describe('RatingProfileComponent', () => {
  let component: RatingDetailsComponent;
  let fixture: ComponentFixture<RatingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RatingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
  fixture = TestBed.createComponent(RatingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
