import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodePanelComponent } from './barcode-panel.component';

describe('BarcodePanelComponent', () => {
  let component: BarcodePanelComponent;
  let fixture: ComponentFixture<BarcodePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarcodePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
