import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DexValComponent } from './dex-val.component';

describe('DexValComponent', () => {
  let component: DexValComponent;
  let fixture: ComponentFixture<DexValComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DexValComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DexValComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
