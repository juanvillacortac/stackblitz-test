import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetIndComponent } from './target-ind.component';

describe('TargetIndComponent', () => {
  let component: TargetIndComponent;
  let fixture: ComponentFixture<TargetIndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetIndComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetIndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
