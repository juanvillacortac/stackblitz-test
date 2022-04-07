import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsDialogComponent } from './tabs-dialog.component';

describe('TabsDialogComponent', () => {
  let component: TabsDialogComponent;
  let fixture: ComponentFixture<TabsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
