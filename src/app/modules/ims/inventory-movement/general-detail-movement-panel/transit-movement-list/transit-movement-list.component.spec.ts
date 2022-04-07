import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitMovementListComponent } from './transit-movement-list.component';

describe('TransitMovementListComponent', () => {
  let component: TransitMovementListComponent;
  let fixture: ComponentFixture<TransitMovementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransitMovementListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransitMovementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
