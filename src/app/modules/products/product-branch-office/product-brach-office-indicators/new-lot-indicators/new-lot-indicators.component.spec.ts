import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLotIndicatorsComponent } from './new-lot-indicators.component';

describe('NewLotIndicatorsComponent', () => {
  let component: NewLotIndicatorsComponent;
  let fixture: ComponentFixture<NewLotIndicatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewLotIndicatorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLotIndicatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
