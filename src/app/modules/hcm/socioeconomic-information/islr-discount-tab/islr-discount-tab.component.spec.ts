import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IslrDiscountTabComponent } from './islr-discount-tab.component';

describe('IslrDiscountTabComponent', () => {
  let component: IslrDiscountTabComponent;
  let fixture: ComponentFixture<IslrDiscountTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IslrDiscountTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IslrDiscountTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
