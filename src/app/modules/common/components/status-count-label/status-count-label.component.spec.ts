import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusCountLabelComponent } from './status-count-label.component';

describe('StatusCountLabelComponent', () => {
  let component: StatusCountLabelComponent;
  let fixture: ComponentFixture<StatusCountLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusCountLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusCountLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
