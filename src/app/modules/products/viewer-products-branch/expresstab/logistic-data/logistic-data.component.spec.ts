import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticDataComponent } from './logistic-data.component';

describe('LogisticDataComponent', () => {
  let component: LogisticDataComponent;
  let fixture: ComponentFixture<LogisticDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogisticDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogisticDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
