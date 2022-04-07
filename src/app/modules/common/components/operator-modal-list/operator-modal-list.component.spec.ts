import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorModalListComponent } from './operator-modal-list.component';

describe('OperatorModalListComponent', () => {
  let component: OperatorModalListComponent;
  let fixture: ComponentFixture<OperatorModalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperatorModalListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorModalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
