import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonCancelReceptionComponent } from './reason-cancel-reception.component';

describe('ReasonCancelReceptionComponent', () => {
  let component: ReasonCancelReceptionComponent;
  let fixture: ComponentFixture<ReasonCancelReceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasonCancelReceptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonCancelReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
