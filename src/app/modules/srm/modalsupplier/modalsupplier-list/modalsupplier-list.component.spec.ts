import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalsupplierListComponent } from './modalsupplier-list.component';

describe('ModalsupplierListComponent', () => {
  let component: ModalsupplierListComponent;
  let fixture: ComponentFixture<ModalsupplierListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalsupplierListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalsupplierListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
