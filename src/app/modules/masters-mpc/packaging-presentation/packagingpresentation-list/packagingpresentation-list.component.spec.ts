import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagingpresentationListComponent } from './packagingpresentation-list.component';

describe('PackagingpresentationListComponent', () => {
  let component: PackagingpresentationListComponent;
  let fixture: ComponentFixture<PackagingpresentationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackagingpresentationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagingpresentationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
