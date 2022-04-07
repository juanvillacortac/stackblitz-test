import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdaterButtonComponent } from './updater-button.component';

describe('UpdaterButtonComponent', () => {
  let component: UpdaterButtonComponent;
  let fixture: ComponentFixture<UpdaterButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdaterButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdaterButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
