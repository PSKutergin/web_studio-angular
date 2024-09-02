import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActiveParamsType } from 'src/app/types/active-params.type';
import { ArticleType } from 'src/app/types/article.type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  getArticles(params: ActiveParamsType): Observable<{ count: number, pages: number, items: ArticleType[] }> {
    // Начинаем с создания пустого HttpParams
    let httpParams = new HttpParams()
      .set('page', params.page.toString());

    // Если есть категории, добавляем их в параметры запроса
    if (params.categories && params.categories.length > 0) {
      params.categories.forEach(category => {
        httpParams = httpParams.append('categories[]', category);
      });
    }

    return this.http.get<{ count: number, pages: number, items: ArticleType[] }>(environment.api + 'articles', { params: httpParams });
  }

  getTopArticles(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/top');
  }

  getArticle(url: string): Observable<ArticleType> {
    return this.http.get<ArticleType>(environment.api + 'articles/' + url);
  }
}
