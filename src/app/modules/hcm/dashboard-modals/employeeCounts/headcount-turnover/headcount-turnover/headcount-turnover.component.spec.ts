import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadcountTurnoverComponent } from './headcount-turnover.component';

describe('HeadcountTurnoverComponent', () => {
  let component: HeadcountTurnoverComponent;
  let fixture: ComponentFixture<HeadcountTurnoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadcountTurnoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadcountTurnoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
