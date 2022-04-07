import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxDedHeaderComponent } from './tax-ded-header.component';

describe('TaxDedHeaderComponent', () => {
  let component: TaxDedHeaderComponent;
  let fixture: ComponentFixture<TaxDedHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxDedHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxDedHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
