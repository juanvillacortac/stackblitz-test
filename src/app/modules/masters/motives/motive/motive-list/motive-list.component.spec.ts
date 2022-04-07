import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MotiveListComponent } from './motive-list.component';



describe('MotiveListComponent', () => {
  let component: MotiveListComponent;
  let fixture: ComponentFixture<MotiveListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotiveListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotiveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
