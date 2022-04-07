import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MasterVehicleListComponent } from './master-vehicle-list.component';

describe('MasterVehicleListComponent', () => {
  let component: MasterVehicleListComponent;
  let fixture: ComponentFixture<MasterVehicleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterVehicleListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterVehicleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
