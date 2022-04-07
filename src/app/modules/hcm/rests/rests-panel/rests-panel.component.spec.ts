import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestsPanelComponent } from './rests-panel.component';

describe('RestsPanelComponent', () => {
  let component: RestsPanelComponent;
  let fixture: ComponentFixture<RestsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestsPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
