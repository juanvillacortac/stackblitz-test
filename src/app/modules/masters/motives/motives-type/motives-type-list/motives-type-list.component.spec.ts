import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MotivesTypeListComponent } from './motives-type-list.component';

describe('MotivesTypeListComponent', () => {
  let component: MotivesTypeListComponent;
  let fixture: ComponentFixture<MotivesTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotivesTypeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivesTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
