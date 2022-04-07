import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaxeTypeApplicationListComponent } from './taxe-type-application-list.component';


describe('TaxeTypeApplicationListComponent', () => {
  let component: TaxeTypeApplicationListComponent;
  let fixture: ComponentFixture<TaxeTypeApplicationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxeTypeApplicationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxeTypeApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
