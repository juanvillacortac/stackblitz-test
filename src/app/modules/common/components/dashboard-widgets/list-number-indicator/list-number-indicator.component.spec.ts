import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNumberIndicatorComponent } from './list-number-indicator.component';

describe('ListNumberIndicatorComponent', () => {
  let component: ListNumberIndicatorComponent;
  let fixture: ComponentFixture<ListNumberIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListNumberIndicatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNumberIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
