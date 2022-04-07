import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericMasterPanelComponent } from './generic-master-panel.component';

describe('GenericMasterPanelComponent', () => {
  let component: GenericMasterPanelComponent;
  let fixture: ComponentFixture<GenericMasterPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericMasterPanelComponent ]
    })
    .compileComponents(); 
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericMasterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
