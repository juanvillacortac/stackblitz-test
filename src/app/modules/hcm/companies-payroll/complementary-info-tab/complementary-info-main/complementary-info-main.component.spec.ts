import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesComplementaryInfoMainComponent } from './complementary-info-main.component';

describe('CompaniesComplementaryInfoMainComponent', () => {
  let component: CompaniesComplementaryInfoMainComponent;
  let fixture: ComponentFixture<CompaniesComplementaryInfoMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesComplementaryInfoMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesComplementaryInfoMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
