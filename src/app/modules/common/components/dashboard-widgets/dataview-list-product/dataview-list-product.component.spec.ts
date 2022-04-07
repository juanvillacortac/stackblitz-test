import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataviewListProductComponent } from './dataview-list-product.component';

describe('DataviewListProductComponent', () => {
  let component: DataviewListProductComponent;
  let fixture: ComponentFixture<DataviewListProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataviewListProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataviewListProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
