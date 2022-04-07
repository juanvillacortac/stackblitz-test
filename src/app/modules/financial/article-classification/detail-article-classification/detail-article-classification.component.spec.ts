import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailArticleClassificationComponent } from './detail-article-classification.component';

describe('DetailArticleClassificationComponent', () => {
  let component: DetailArticleClassificationComponent;
  let fixture: ComponentFixture<DetailArticleClassificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailArticleClassificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailArticleClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
