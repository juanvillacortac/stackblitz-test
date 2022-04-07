import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectButtonOptionComponent } from './select-button-option.component';

describe('SelectButtonOptionComponent', () => {
  let component: SelectButtonOptionComponent;
  let fixture: ComponentFixture<SelectButtonOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectButtonOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectButtonOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
