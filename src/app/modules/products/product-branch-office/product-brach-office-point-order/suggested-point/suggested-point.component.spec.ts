import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedPointComponent } from './suggested-point.component';

describe('SuggestedPointComponent', () => {
  let component: SuggestedPointComponent;
  let fixture: ComponentFixture<SuggestedPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuggestedPointComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestedPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
