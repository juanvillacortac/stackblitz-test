import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserModalListComponent } from './user-modal-list.component';

describe('UserModalListComponent', () => {
  let component: UserModalListComponent;
  let fixture: ComponentFixture<UserModalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserModalListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserModalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
