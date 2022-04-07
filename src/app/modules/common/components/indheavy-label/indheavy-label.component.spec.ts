import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndheavyLabelComponent } from './indheavy-label.component';

describe('IndheavyLabelComponent', () => {
  let component: IndheavyLabelComponent;
  let fixture: ComponentFixture<IndheavyLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndheavyLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndheavyLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
