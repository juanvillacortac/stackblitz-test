import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericMasterListComponent } from './generic-master-list.component';

describe('GenericMasterListComponent', () => {
  let component: GenericMasterListComponent;
  let fixture: ComponentFixture<GenericMasterListComponent>;

  beforeEach(async () => { 
    await TestBed.configureTestingModule({
      declarations: [ GenericMasterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
