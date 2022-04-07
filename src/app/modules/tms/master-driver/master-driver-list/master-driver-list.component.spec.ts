import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDriverListComponent } from './master-driver-list.component';

describe('MasterDriverListComponent', () => {
  let component: MasterDriverListComponent;
  let fixture: ComponentFixture<MasterDriverListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDriverListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDriverListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
