import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationDialogComponent } from './specification-dialog.component';

describe('SpecificationDialogComponent', () => {
  let component: SpecificationDialogComponent;
  let fixture: ComponentFixture<SpecificationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecificationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
