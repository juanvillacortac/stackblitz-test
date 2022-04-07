import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionChildHeaderComponent } from './reception-child-header.component';

describe('ReceptionChildHeaderComponent', () => {
  let component: ReceptionChildHeaderComponent;
  let fixture: ComponentFixture<ReceptionChildHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceptionChildHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionChildHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
