import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotsDetailsComponent } from './lots-details.component';

describe('LotsDetailsComponent', () => {
  let component: LotsDetailsComponent;
  let fixture: ComponentFixture<LotsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LotsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LotsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
