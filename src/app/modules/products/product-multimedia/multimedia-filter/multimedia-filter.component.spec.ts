import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultimediaFilterComponent } from './multimedia-filter.component';

describe('MultimediaFilterComponent', () => {
  let component: MultimediaFilterComponent;
  let fixture: ComponentFixture<MultimediaFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultimediaFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultimediaFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
