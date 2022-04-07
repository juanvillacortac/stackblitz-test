import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeOptionFilterComponent } from './attribute-option-filter.component';

describe('AttributeOptionFilterComponent', () => {
  let component: AttributeOptionFilterComponent;
  let fixture: ComponentFixture<AttributeOptionFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttributeOptionFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeOptionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
