import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstgSalarytypesDetailComponent } from './mstg-salarytypes-detail.component';

describe('MstgSalarytypesDetailComponent', () => {
  let component: MstgSalarytypesDetailComponent;
  let fixture: ComponentFixture<MstgSalarytypesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstgSalarytypesDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstgSalarytypesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
