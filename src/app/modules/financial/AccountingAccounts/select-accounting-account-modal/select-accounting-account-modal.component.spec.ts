import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAccountingAccountModalComponent } from './select-accounting-account-modal.component';

describe('SelectAccountingAccountModalComponent', () => {
  let component: SelectAccountingAccountModalComponent;
  let fixture: ComponentFixture<SelectAccountingAccountModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectAccountingAccountModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAccountingAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
