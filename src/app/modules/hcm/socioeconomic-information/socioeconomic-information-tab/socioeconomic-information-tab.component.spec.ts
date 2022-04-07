import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocioeconomicInformationTabComponent } from './socioeconomic-information-tab.component';

describe('SocioeconomicInformationTabComponent', () => {
  let component: SocioeconomicInformationTabComponent;
  let fixture: ComponentFixture<SocioeconomicInformationTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocioeconomicInformationTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocioeconomicInformationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
