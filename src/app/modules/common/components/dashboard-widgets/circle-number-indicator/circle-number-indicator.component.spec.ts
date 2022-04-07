import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleNumberIndicatorComponent } from './circle-number-indicator.component';

describe('CircleNumberIndicatorComponent', () => {
  let component: CircleNumberIndicatorComponent;
  let fixture: ComponentFixture<CircleNumberIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CircleNumberIndicatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleNumberIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
