import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleClassificationPanelComponent } from './article-classification-panel.component';

describe('ArticleClassificationPanelComponent', () => {
  let component: ArticleClassificationPanelComponent;
  let fixture: ComponentFixture<ArticleClassificationPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleClassificationPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleClassificationPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
