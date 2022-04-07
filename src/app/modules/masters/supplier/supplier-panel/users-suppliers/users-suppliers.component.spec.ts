import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersSuppliersComponent } from './users-suppliers.component';

describe('UsersSuppliersComponent', () => {
  let component: UsersSuppliersComponent;
  let fixture: ComponentFixture<UsersSuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersSuppliersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
