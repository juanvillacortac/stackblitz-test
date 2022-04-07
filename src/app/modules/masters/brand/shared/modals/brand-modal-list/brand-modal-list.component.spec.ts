import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandModalListComponent } from './brand-modal-list.component';

describe('BrandModalListComponent', () => {
  let component: BrandModalListComponent;
  let fixture: ComponentFixture<BrandModalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandModalListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandModalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
