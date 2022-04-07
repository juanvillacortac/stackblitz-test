import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountForCountModalListComponent } from './count-for-count-modal-list.component';

describe('CountForCountModalListComponent', () => {
  let component: CountForCountModalListComponent;
  let fixture: ComponentFixture<CountForCountModalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountForCountModalListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountForCountModalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
