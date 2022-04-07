import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MotivesTypeDetailComponent } from './motives-type-detail.component';


describe('MotivesTypeDetailComponent', () => {
  let component: MotivesTypeDetailComponent;
  let fixture: ComponentFixture<MotivesTypeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotivesTypeDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivesTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
