import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseofpackagingListComponent } from './useofpackaging-list.component';

describe('UseofpackagingListComponent', () => {
  let component: UseofpackagingListComponent;
  let fixture: ComponentFixture<UseofpackagingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UseofpackagingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UseofpackagingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
