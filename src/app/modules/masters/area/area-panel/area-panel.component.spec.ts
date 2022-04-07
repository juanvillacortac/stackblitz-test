import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaPanelComponent } from './area-panel.component';

describe('AreaPanelComponent', () => {
  let component: AreaPanelComponent;
  let fixture: ComponentFixture<AreaPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
