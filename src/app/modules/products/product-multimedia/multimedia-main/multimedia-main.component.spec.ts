import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultimediaMainComponent } from './multimedia-main.component';

describe('MultimediaMainComponent', () => {
  let component: MultimediaMainComponent;
  let fixture: ComponentFixture<MultimediaMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultimediaMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultimediaMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
