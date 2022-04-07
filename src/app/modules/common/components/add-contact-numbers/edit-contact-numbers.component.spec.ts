import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContactNumbersComponent } from './edit-contact-numbers.component';

describe('EditContactNumbersComponent', () => {
  let component: EditContactNumbersComponent;
  let fixture: ComponentFixture<EditContactNumbersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditContactNumbersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContactNumbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
