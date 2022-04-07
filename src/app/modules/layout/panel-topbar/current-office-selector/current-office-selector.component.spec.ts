import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentOfficeSelectorComponent } from './current-office-selector.component';

describe('CurrentOfficeSelectorComponent', () => {
  let component: CurrentOfficeSelectorComponent;
  let fixture: ComponentFixture<CurrentOfficeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentOfficeSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentOfficeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
