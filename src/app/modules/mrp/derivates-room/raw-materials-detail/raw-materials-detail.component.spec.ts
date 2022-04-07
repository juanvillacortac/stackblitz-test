import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialsDetailComponent } from './raw-materials-detail.component';

describe('RawMaterialsDetailComponent', () => {
  let component: RawMaterialsDetailComponent;
  let fixture: ComponentFixture<RawMaterialsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RawMaterialsDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RawMaterialsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
