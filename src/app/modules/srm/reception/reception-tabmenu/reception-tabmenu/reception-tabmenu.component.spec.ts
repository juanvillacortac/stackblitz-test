import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionTabmenuComponent } from './reception-tabmenu.component';

describe('ReceptionTabmenuComponent', () => {
  let component: ReceptionTabmenuComponent;
  let fixture: ComponentFixture<ReceptionTabmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceptionTabmenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionTabmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
