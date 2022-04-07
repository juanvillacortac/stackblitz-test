import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestsListComponent } from './rests-list.component';

describe('RestsListComponent', () => {
  let component: RestsListComponent;
  let fixture: ComponentFixture<RestsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
