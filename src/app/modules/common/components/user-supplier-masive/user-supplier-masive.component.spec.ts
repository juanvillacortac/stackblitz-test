import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSupplierMasiveComponent } from './user-supplier-masive.component';

describe('UserSupplierMasiveComponent', () => {
  let component: UserSupplierMasiveComponent;
  let fixture: ComponentFixture<UserSupplierMasiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserSupplierMasiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSupplierMasiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
