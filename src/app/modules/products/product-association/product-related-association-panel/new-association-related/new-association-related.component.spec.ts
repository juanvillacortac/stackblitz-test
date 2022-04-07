import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAssociationRelatedComponent } from './new-association-related.component';

describe('NewAssociationRelatedComponent', () => {
  let component: NewAssociationRelatedComponent;
  let fixture: ComponentFixture<NewAssociationRelatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAssociationRelatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAssociationRelatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
