import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormativesPanelComponent } from './normatives-panel.component';

describe('NormativesPanelComponent', () => {
  let component: NormativesPanelComponent;
  let fixture: ComponentFixture<NormativesPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NormativesPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NormativesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
