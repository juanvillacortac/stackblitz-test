import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostsOfTheArticleModalComponent } from './costs-of-the-article-modal.component';

describe('CostsOfTheArticleModalComponent', () => {
  let component: CostsOfTheArticleModalComponent;
  let fixture: ComponentFixture<CostsOfTheArticleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostsOfTheArticleModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostsOfTheArticleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
