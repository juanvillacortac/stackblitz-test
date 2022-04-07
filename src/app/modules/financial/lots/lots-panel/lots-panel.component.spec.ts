import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotsPanelComponent } from './lots-panel.component';

describe('LotsPanelComponent', () => {
  let component: LotsPanelComponent;
  let fixture: ComponentFixture<LotsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LotsPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LotsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
