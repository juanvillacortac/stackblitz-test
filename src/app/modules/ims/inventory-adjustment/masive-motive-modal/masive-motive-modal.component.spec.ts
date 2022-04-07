import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasiveMotiveModalComponent } from './masive-motive-modal.component';

describe('MasiveMotiveModalComponent', () => {
  let component: MasiveMotiveModalComponent;
  let fixture: ComponentFixture<MasiveMotiveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasiveMotiveModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasiveMotiveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
