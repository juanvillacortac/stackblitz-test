import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCountDetailComponent } from './add-count-detail.component';

describe('AddCountDetailComponent', () => {
  let component: AddCountDetailComponent;
  let fixture: ComponentFixture<AddCountDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCountDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCountDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
