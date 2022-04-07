import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionMainComponent } from './reception-main.component';

describe('ReceptionMainComponent', () => {
  let component: ReceptionMainComponent;
  let fixture: ComponentFixture<ReceptionMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceptionMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
