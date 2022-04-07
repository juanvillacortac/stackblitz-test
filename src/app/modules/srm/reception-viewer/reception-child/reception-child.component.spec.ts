import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionChildComponent } from './reception-child.component';

describe('ReceptionChildComponent', () => {
  let component: ReceptionChildComponent;
  let fixture: ComponentFixture<ReceptionChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceptionChildComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
