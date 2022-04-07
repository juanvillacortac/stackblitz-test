import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingStatComponent } from './ranking-stat.component';

describe('RankingStatComponent', () => {
  let component: RankingStatComponent;
  let fixture: ComponentFixture<RankingStatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RankingStatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RankingStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
