import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstgPayrolltypesComponent } from './mstg-payrolltypes.component';

describe('MstgPayrolltypesComponent', () => {
  let component: MstgPayrolltypesComponent;
  let fixture: ComponentFixture<MstgPayrolltypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstgPayrolltypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstgPayrolltypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
