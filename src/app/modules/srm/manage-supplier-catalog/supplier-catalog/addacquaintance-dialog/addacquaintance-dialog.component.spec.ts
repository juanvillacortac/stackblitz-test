import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddacquaintanceDialogComponent } from './addacquaintance-dialog.component';

describe('AddacquaintanceDialogComponent', () => {
  let component: AddacquaintanceDialogComponent;
  let fixture: ComponentFixture<AddacquaintanceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddacquaintanceDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddacquaintanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
