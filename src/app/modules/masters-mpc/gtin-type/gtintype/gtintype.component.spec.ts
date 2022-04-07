import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GtintypeComponent } from './gtintype.component';

describe('GtintypeComponent', () => {
  let component: GtintypeComponent;
  let fixture: ComponentFixture<GtintypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GtintypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GtintypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
