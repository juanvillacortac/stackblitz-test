import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterRequestSetupListComponent } from './master-request-setup-list.component';

describe('MasterRequestSetupListComponent', () => {
  let component: MasterRequestSetupListComponent;
  let fixture: ComponentFixture<MasterRequestSetupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterRequestSetupListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterRequestSetupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
