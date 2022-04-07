import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxDedHeaderEditComponent } from './tax-ded-header-edit.component';

describe('TaxDedHeaderEditComponent', () => {
  let component: TaxDedHeaderEditComponent;
  let fixture: ComponentFixture<TaxDedHeaderEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxDedHeaderEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxDedHeaderEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
