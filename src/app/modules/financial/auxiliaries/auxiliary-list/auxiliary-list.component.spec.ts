import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuxiliaryListComponent } from './auxiliary-list.component';

describe('AuxiliaryListComponent', () => {
  let component: AuxiliaryListComponent;
  let fixture: ComponentFixture<AuxiliaryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuxiliaryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuxiliaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
