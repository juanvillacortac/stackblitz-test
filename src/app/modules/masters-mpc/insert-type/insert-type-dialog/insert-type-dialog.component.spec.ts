import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertTypeDialogComponent } from './insert-type-dialog.component';

describe('InsertTypeDialogComponent', () => {
  let component: InsertTypeDialogComponent;
  let fixture: ComponentFixture<InsertTypeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertTypeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
