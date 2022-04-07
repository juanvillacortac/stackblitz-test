import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsSearchComponent } from './materials-search.component';

describe('MaterialsSearchComponent', () => {
  let component: MaterialsSearchComponent;
  let fixture: ComponentFixture<MaterialsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialsSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
