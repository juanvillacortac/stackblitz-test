import { TestBed } from '@angular/core/testing';

import { ArticleClassificationService } from './article-classification.service';

describe('ArticleClassificationService', () => {
  let service: ArticleClassificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticleClassificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
