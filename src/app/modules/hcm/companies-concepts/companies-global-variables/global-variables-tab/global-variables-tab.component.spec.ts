import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalVariablesTabComponent } from './global-variables-tab.component';

describe('GlobalVariablesTabComponent', () => {
  let component: GlobalVariablesTabComponent;
  let fixture: ComponentFixture<GlobalVariablesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalVariablesTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalVariablesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
