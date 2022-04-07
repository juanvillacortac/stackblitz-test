import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailMovementListComponent } from './detail-movement-list.component';

describe('DetailMovementListComponent', () => {
  let component: DetailMovementListComponent;
  let fixture: ComponentFixture<DetailMovementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailMovementListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailMovementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
