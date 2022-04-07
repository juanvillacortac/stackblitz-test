import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonCancelComponent } from './reason-cancel.component';

describe('ReasonCancelComponent', () => {
  let component: ReasonCancelComponent;
  let fixture: ComponentFixture<ReasonCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasonCancelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
