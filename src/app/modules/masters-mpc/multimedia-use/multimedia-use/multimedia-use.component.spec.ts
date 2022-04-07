import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultimediaUseComponent } from './multimedia-use.component';

describe('MultimediaUseComponent', () => {
  let component: MultimediaUseComponent;
  let fixture: ComponentFixture<MultimediaUseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultimediaUseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultimediaUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
