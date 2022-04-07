import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentsLoadIntegrationComponent } from './incidents-load-integration.component';

describe('IncidentsLoadIntegrationComponent', () => {
  let component: IncidentsLoadIntegrationComponent;
  let fixture: ComponentFixture<IncidentsLoadIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentsLoadIntegrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentsLoadIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
