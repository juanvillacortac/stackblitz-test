import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAssociationComponentComponent } from './new-association-component.component';

describe('NewAssociationComponentComponent', () => {
  let component: NewAssociationComponentComponent;
  let fixture: ComponentFixture<NewAssociationComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAssociationComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAssociationComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
