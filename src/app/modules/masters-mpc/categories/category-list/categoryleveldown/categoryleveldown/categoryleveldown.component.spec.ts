import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryleveldownComponent } from './categoryleveldown.component';

describe('CategoryleveldownComponent', () => {
  let component: CategoryleveldownComponent;
  let fixture: ComponentFixture<CategoryleveldownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryleveldownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryleveldownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
