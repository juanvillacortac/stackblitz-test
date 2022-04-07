import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProductoCountModalComponent } from './new-producto-count-modal.component';

describe('NewProductoCountModalComponent', () => {
  let component: NewProductoCountModalComponent;
  let fixture: ComponentFixture<NewProductoCountModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewProductoCountModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProductoCountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
