import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeofpartsListComponent } from './typeofparts-list.component';

describe('TypeofpartsListComponent', () => {
  let component: TypeofpartsListComponent;
  let fixture: ComponentFixture<TypeofpartsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeofpartsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeofpartsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
