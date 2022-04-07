import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercendIndConditionComponent } from './percend-ind-condition.component';

describe('PercendIndConditionComponent', () => {
  let component: PercendIndConditionComponent;
  let fixture: ComponentFixture<PercendIndConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PercendIndConditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PercendIndConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
