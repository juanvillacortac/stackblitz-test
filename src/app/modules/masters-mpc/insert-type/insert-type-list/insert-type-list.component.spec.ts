import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertTypeListComponent } from './insert-type-list.component';

describe('InsertTypeListComponent', () => {
  let component: InsertTypeListComponent;
  let fixture: ComponentFixture<InsertTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertTypeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
