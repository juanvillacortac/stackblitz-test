import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterRouteListComponent } from './master-route-list.component';

describe('MasterRouteListComponent', () => {
  let component: MasterRouteListComponent;
  let fixture: ComponentFixture<MasterRouteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterRouteListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterRouteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
