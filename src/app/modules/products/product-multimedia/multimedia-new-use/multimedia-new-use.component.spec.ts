import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultimediaNewUseComponent } from './multimedia-new-use.component';

describe('MultimediaNewUseComponent', () => {
  let component: MultimediaNewUseComponent;
  let fixture: ComponentFixture<MultimediaNewUseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultimediaNewUseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultimediaNewUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
