import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCompleteUserSearchComponent } from './auto-complete-user-search.component';

describe('AutoCompleteUserSearchComponent', () => {
  let component: AutoCompleteUserSearchComponent;
  let fixture: ComponentFixture<AutoCompleteUserSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoCompleteUserSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoCompleteUserSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
