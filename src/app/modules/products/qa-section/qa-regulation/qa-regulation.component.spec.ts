import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QaRegulationComponent } from './qa-regulation.component';

describe('QaRegulationComponent', () => {
  let component: QaRegulationComponent;
  let fixture: ComponentFixture<QaRegulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QaRegulationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QaRegulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
