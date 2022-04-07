import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultimediaNewComponent } from './multimedia-new.component';

describe('MultimediaNewComponent', () => {
  let component: MultimediaNewComponent;
  let fixture: ComponentFixture<MultimediaNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultimediaNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultimediaNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
