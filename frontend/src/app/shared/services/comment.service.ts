import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentType } from 'src/app/types/comment.type';
import { DefaultResponseType } from 'src/app/types/default-response.type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  getCommentsByArticle({ article, offset }: { article: string, offset: number }): Observable<{ allCount: number, comments: CommentType[] }> {
    return this.http.get<{ allCount: number, comments: CommentType[] }>(environment.api + 'comments', { params: { offset, article } });
  }

  getArticleCommentActionsForUser(articleId: string): Observable<{ comment: string, action: string }[]> {
    return this.http.get<{ comment: string, action: string }[]>(environment.api + 'comments/article-comment-actions', { params: { articleId } });
  }

  addNewComment({ article, text }: { article: string, text: string }): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', { text, article });
  }

  addNewCommentAction({ commentId, action }: { commentId: string, action: string }): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + commentId + '/apply-action', { action });
  }
}