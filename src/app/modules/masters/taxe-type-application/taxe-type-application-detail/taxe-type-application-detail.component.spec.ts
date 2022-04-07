import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaxeTypeApplicationDetailComponent } from './taxe-type-application-detail.component';


describe('TaxeTypeApplicationDetailComponent', () => {
  let component: TaxeTypeApplicationDetailComponent;
  let fixture: ComponentFixture<TaxeTypeApplicationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxeTypeApplicationDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxeTypeApplicationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
