import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingDialogComponent } from './packing-dialog.component';

describe('PackingDialogComponent', () => {
  let component: PackingDialogComponent;
  let fixture: ComponentFixture<PackingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackingDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
