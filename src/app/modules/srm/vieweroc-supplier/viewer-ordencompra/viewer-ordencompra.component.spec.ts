import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerOrdencompraComponent } from './viewer-ordencompra.component';

describe('ViewerOrdencompraComponent', () => {
  let component: ViewerOrdencompraComponent;
  let fixture: ComponentFixture<ViewerOrdencompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerOrdencompraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerOrdencompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
