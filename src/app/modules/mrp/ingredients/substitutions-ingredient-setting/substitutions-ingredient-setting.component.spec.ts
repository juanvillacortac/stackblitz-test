import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstitutionsIngredientSettingComponent } from './substitutions-ingredient-setting.component';

describe('SubstitutionsIngredientSettingComponent', () => {
  let component: SubstitutionsIngredientSettingComponent;
  let fixture: ComponentFixture<SubstitutionsIngredientSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstitutionsIngredientSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstitutionsIngredientSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
