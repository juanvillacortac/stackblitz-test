import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticdataMainComponent } from './logisticdata-main.component';

describe('LogisticdataMainComponent', () => {
  let component: LogisticdataMainComponent;
  let fixture: ComponentFixture<LogisticdataMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogisticdataMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogisticdataMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
