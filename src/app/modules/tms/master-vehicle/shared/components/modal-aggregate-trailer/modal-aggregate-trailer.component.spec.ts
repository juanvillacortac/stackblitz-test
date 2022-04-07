import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAggregateTrailerComponent } from './modal-aggregate-trailer.component';

describe('ModalAggregateTrailerComponent', () => {
  let component: ModalAggregateTrailerComponent;
  let fixture: ComponentFixture<ModalAggregateTrailerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAggregateTrailerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAggregateTrailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
