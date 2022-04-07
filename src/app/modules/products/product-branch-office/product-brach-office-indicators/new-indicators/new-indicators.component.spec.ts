import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewIndicatorsComponent } from './new-indicators.component';

describe('NewIndicatorsComponent', () => {
  let component: NewIndicatorsComponent;
  let fixture: ComponentFixture<NewIndicatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewIndicatorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewIndicatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
