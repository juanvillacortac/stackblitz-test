import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedProdComponent } from './selected-prod.component';

describe('SelectedProdComponent', () => {
  let component: SelectedProdComponent;
  let fixture: ComponentFixture<SelectedProdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedProdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
