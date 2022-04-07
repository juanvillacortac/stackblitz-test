import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DedComponent } from './ded.component';

describe('DedComponent', () => {
  let component: DedComponent;
  let fixture: ComponentFixture<DedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
