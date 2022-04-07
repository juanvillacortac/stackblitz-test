import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDedComponent } from './add-ded.component';

describe('AddDedComponent', () => {
  let component: AddDedComponent;
  let fixture: ComponentFixture<AddDedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
