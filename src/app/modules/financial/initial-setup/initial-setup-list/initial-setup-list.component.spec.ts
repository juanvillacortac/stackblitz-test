import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialSetupListComponent } from './initial-setup-list.component';

describe('InitialSetupListComponent', () => {
  let component: InitialSetupListComponent;
  let fixture: ComponentFixture<InitialSetupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitialSetupListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialSetupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
