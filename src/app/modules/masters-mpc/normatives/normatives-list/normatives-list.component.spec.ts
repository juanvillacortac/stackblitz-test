import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormativesListComponent } from './normatives-list.component';

describe('NormativesListComponent', () => {
  let component: NormativesListComponent;
  let fixture: ComponentFixture<NormativesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NormativesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NormativesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
