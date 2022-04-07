import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcFilterComponent } from './oc-filter.component';

describe('OcFilterComponent', () => {
  let component: OcFilterComponent;
  let fixture: ComponentFixture<OcFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
