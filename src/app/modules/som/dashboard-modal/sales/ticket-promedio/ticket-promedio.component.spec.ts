import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPromedioComponent } from './ticket-promedio.component';

describe('TicketPromedioComponent', () => {
  let component: TicketPromedioComponent;
  let fixture: ComponentFixture<TicketPromedioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketPromedioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketPromedioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
