import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/shared/services/article.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ArticleType } from 'src/app/types/article.type';
import { CategoryType } from 'src/app/types/category.type';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  articles: ArticleType[] = []
  filtersOpen: boolean = false;
  page: number = 2;
  filters: CategoryType[] = [];
  appliedFilters: CategoryType[] = [
    {
      "id": "66cb98ed8e8cef82eb34e22a",
      "name": "Фриланс",
      "url": "frilans"
    },
    {
      "id": "66cb98ed8e8cef82eb34e22b",
      "name": "Дизайн",
      "url": "dizain"
    },
    {
      "id": "66cb98ed8e8cef82eb34e22c",
      "name": "SMM",
      "url": "smm"
    },
    {
      "id": "66cb98ed8e8cef82eb34e22d",
      "name": "Таргет",
      "url": "target"
    },
    {
      "id": "66cb98ed8e8cef82eb34e22e",
      "name": "Копирайтинг",
      "url": "kopiraiting"
    }
  ];

  constructor(private articleService: ArticleService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getCategories()
      .subscribe((data: CategoryType[]) => {
        this.filters = data;
      });

    this.articleService.getArticles({
      page: this.page,
      categories: this.appliedFilters.map(item => item.url)
    })
      .subscribe((data: { count: number, pages: number, items: ArticleType[] }) => {
        this.articles = data.items;
      });

  }

  toggleFilters(event: Event): void {
    this.filtersOpen = !this.filtersOpen;
    event.stopPropagation();
  }

  removeAppliedFilter(filter: CategoryType): void {
    this.appliedFilters = this.appliedFilters.filter((item: CategoryType) => item !== filter);
  }

}
