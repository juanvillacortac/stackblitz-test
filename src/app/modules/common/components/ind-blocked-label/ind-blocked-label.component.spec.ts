import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndBlockedLabelComponent } from './ind-blocked-label.component';

describe('IndBlockedLabelComponent', () => {
  let component: IndBlockedLabelComponent;
  let fixture: ComponentFixture<IndBlockedLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndBlockedLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndBlockedLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
