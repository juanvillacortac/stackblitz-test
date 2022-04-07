import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionConfirmedComponent } from './selection-confirmed.component';

describe('SelectionConfirmedComponent', () => {
  let component: SelectionConfirmedComponent;
  let fixture: ComponentFixture<SelectionConfirmedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectionConfirmedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionConfirmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
