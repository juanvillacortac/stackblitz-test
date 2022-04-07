import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WastagePanelComponent } from './wastage-panel.component';

describe('WastagePanelComponent', () => {
  let component: WastagePanelComponent;
  let fixture: ComponentFixture<WastagePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WastagePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WastagePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
