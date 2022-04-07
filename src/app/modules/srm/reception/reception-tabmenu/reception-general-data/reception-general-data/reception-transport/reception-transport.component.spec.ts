import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionTransportComponent } from './reception-transport.component';

describe('ReceptionTransportComponent', () => {
  let component: ReceptionTransportComponent;
  let fixture: ComponentFixture<ReceptionTransportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceptionTransportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionTransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
