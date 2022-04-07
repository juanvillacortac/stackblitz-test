import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionPlansResumeComponent } from './production-plans-resume.component';

describe('ProductionPlansResumeComponent', () => {
  let component: ProductionPlansResumeComponent;
  let fixture: ComponentFixture<ProductionPlansResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionPlansResumeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionPlansResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
