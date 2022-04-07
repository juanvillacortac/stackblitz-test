import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterFormButtonsComponent } from './footer-form-buttons.component';

describe('FooterFormButtonsComponent', () => {
  let component: FooterFormButtonsComponent;
  let fixture: ComponentFixture<FooterFormButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterFormButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterFormButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
