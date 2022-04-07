import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeagrupationListComponent } from './attributeagrupation-list.component';

describe('AttributeagrupationListComponent', () => {
  let component: AttributeagrupationListComponent;
  let fixture: ComponentFixture<AttributeagrupationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttributeagrupationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeagrupationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
