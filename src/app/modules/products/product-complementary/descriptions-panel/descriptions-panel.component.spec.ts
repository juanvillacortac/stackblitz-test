import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionsPanelComponent } from './descriptions-panel.component';

describe('DescriptionsPanelComponent', () => {
  let component: DescriptionsPanelComponent;
  let fixture: ComponentFixture<DescriptionsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptionsPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
