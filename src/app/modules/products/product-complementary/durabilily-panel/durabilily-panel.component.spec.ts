import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DurabililyPanelComponent } from './durabilily-panel.component';

describe('DurabililyPanelComponent', () => {
  let component: DurabililyPanelComponent;
  let fixture: ComponentFixture<DurabililyPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DurabililyPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DurabililyPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
