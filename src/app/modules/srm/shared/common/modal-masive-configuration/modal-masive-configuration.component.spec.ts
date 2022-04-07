import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMasiveConfigurationComponent } from './modal-masive-configuration.component';

describe('ModalMasiveConfigurationComponent', () => {
  let component: ModalMasiveConfigurationComponent;
  let fixture: ComponentFixture<ModalMasiveConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalMasiveConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMasiveConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
