import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamiliBurdenListComponent } from './famili-burden-list.component';

describe('FamiliBurdenListComponent', () => {
  let component: FamiliBurdenListComponent;
  let fixture: ComponentFixture<FamiliBurdenListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamiliBurdenListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamiliBurdenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
