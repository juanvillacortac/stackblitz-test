import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeOptionPanelComponent } from './attribute-option-panel.component';

describe('AttributeOptionPanelComponent', () => {
  let component: AttributeOptionPanelComponent;
  let fixture: ComponentFixture<AttributeOptionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttributeOptionPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeOptionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
