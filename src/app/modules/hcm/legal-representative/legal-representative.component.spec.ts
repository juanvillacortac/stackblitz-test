import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalRepresentativeComponent } from './legal-representative.component';

describe('LegalRepresentativeComponent', () => {
  let component: LegalRepresentativeComponent;
  let fixture: ComponentFixture<LegalRepresentativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LegalRepresentativeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalRepresentativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
