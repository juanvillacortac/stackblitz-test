import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MotiveDetailComponent } from './motive-detail.component';

describe('MotiveDetailComponent', () => {
  let component: MotiveDetailComponent;
  let fixture: ComponentFixture<MotiveDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotiveDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotiveDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
