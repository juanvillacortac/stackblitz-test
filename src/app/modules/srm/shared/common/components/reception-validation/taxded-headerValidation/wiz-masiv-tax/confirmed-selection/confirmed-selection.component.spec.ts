import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmedSelectionComponent } from './confirmed-selection.component';

describe('ConfirmedSelectionComponent', () => {
  let component: ConfirmedSelectionComponent;
  let fixture: ComponentFixture<ConfirmedSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmedSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmedSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
