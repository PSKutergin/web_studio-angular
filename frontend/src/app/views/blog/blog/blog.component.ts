import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from 'src/app/shared/services/article.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ActiveParamsType } from 'src/app/types/active-params.type';
import { AppliedFilterType } from 'src/app/types/applied-filter.type';
import { ArticleType } from 'src/app/types/article.type';
import { CategoryType } from 'src/app/types/category.type';
import { ActiveParamsUtil } from 'src/app/utils/active-params.util';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  activeParams: ActiveParamsType = { categories: [], page: 1 };
  articles: ArticleType[] = []
  filtersOpen: boolean = false;
  pages: number[] = [];
  filters: CategoryType[] = [];
  appliedFilters: AppliedFilterType[] = [];

  constructor(
    private elementRef: ElementRef,
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.categoryService.getCategories()
      .subscribe((data: CategoryType[]) => {
        this.filters = data;

        this.activatedRoute.queryParams
          .subscribe((params) => {
            this.activeParams = ActiveParamsUtil.processParams(params as ActiveParamsType);

            this.appliedFilters = [];
            this.activeParams.categories.forEach((url) => {
              const foundCategory = this.filters.find((category) => category.url === url);
              if (foundCategory) {
                this.appliedFilters.push({
                  name: foundCategory.name,
                  urlParam: foundCategory.url
                });
              }
            });

            this.articleService.getArticles(this.activeParams)
              .subscribe((data: { count: number, pages: number, items: ArticleType[] }) => {
                this.pages = [];
                for (let i = 1; i <= data.pages; i++) {
                  this.pages.push(i);
                }

                this.articles = data.items;
              });
          })
      });
  }

  toggleFilters(event: Event): void {
    this.filtersOpen = !this.filtersOpen;
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;

    if (!this.elementRef.nativeElement.contains(targetElement)) {
      this.filtersOpen = false;
    }
  }

  changeFilter(filter: CategoryType): void {

    if (this.activeParams.categories.includes(filter.url)) {
      this.removeAppliedFilter(filter.url);
    } else {
      this.activeParams.categories = [...this.activeParams.categories, filter.url];
    }

    this.activeParams.page = 1;
    this.router.navigate(['/blog'], { queryParams: this.activeParams });
  }


  removeAppliedFilter(urlParam: string): void {
    this.activeParams.categories = this.activeParams.categories.filter((category) => category !== urlParam);

    this.activeParams.page = 1;
    this.router.navigate(['/blog'], { queryParams: this.activeParams });
  }

  openPage(page: number): void {
    this.activeParams.page = page;
    this.router.navigate(['/blog'], { queryParams: this.activeParams });
  }

  openPrevPage(): void {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/blog'], { queryParams: this.activeParams });
    }
  }

  openNextPage(): void {
    if (this.activeParams.page) {
      if (this.activeParams.page && this.activeParams.page < this.pages.length) {
        this.activeParams.page++;
        this.router.navigate(['/blog'], { queryParams: this.activeParams });
      }
    } else {
      this.router.navigate(['/blog'], { queryParams: this.activeParams });
    }
  }

}
