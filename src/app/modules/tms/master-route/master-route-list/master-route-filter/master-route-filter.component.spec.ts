import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterRouteFilterComponent } from './master-route-filter.component';

describe('MasterRouteFilterComponent', () => {
  let component: MasterRouteFilterComponent;
  let fixture: ComponentFixture<MasterRouteFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterRouteFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterRouteFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
