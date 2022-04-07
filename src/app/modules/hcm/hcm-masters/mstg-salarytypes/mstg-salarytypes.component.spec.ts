import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstgSalarytypesComponent } from './mstg-salarytypes.component';

describe('MstgSalarytypesComponent', () => {
  let component: MstgSalarytypesComponent;
  let fixture: ComponentFixture<MstgSalarytypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstgSalarytypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstgSalarytypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
