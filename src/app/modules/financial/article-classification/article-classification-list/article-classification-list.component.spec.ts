import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleClassificationListComponent } from './article-classification-list.component';

describe('ArticleClassificationListComponent', () => {
  let component: ArticleClassificationListComponent;
  let fixture: ComponentFixture<ArticleClassificationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleClassificationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleClassificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
