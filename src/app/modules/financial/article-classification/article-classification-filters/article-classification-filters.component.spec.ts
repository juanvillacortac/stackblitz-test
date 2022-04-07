import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleClassificationFiltersComponent } from './article-classification-filters.component';

describe('ArticleClassificationFiltersComponent', () => {
  let component: ArticleClassificationFiltersComponent;
  let fixture: ComponentFixture<ArticleClassificationFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleClassificationFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleClassificationFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
