import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionGeneralDataComponent } from './reception-general-data.component';

describe('ReceptionGeneralDataComponent', () => {
  let component: ReceptionGeneralDataComponent;
  let fixture: ComponentFixture<ReceptionGeneralDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceptionGeneralDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionGeneralDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
