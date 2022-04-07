import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAddLotComponent } from './detail-add-lot.component';

describe('DetailAddLotComponent', () => {
  let component: DetailAddLotComponent;
  let fixture: ComponentFixture<DetailAddLotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailAddLotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailAddLotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
