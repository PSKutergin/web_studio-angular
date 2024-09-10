import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ArticleService } from 'src/app/shared/services/article.service';
import { CommentService } from 'src/app/shared/services/comment.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ArticleType } from 'src/app/types/article.type';
import { CommentType } from 'src/app/types/comment.type';
import { DefaultResponseType } from 'src/app/types/default-response.type';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  article!: ArticleType;
  comments: CommentType[] = [];
  offset: number = 3;
  serverStaticPath = environment.serverStaticPath;
  isLogged: boolean = false;
  commentText: string = '';
  isShowLoadMore: boolean = false;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private articleService: ArticleService,
    private commentService: CommentService,
    private loaderService: LoaderService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.isLogged = this.authService.getIsLoggedIn();
    this.loadArticle();

    this.loaderService.show();
  }

  changeShowLoadMore(): void {
    this.isShowLoadMore = this.article.commentsCount && this.article.commentsCount > this.comments.length ? true : false;
  }

  loadArticle(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.articleService.getArticle(params['url'])
        .subscribe((data: ArticleType) => {
          this.article = data;
          this.comments = data.comments ? data.comments : [];

          this.offset > 3 ? this.loadMoreComments() : this.proccesedComment();
        })
    })
  }

  proccesedComment(): void {
    this.changeShowLoadMore();

    if (this.isLogged) {
      this.commentService.getArticleCommentActionsForUser(this.article.id)
        .subscribe((data: { comment: string, action: string }[]) => {
          if (data.length) {
            data.forEach(item => {
              this.comments.map(comment => {
                if (comment.id === item.comment) {
                  comment.userAction = item.action;
                }
              })
            })
          }
        })
    }
  }

  loadMoreComments(): void {
    this.loaderService.show();
    this.isShowLoadMore = false;

    this.commentService.getCommentsByArticle({ article: this.article.id, offset: this.offset })
      .subscribe((data: { allCount: number, comments: CommentType[] }) => {
        this.comments = this.comments.concat(data.comments);

        if (this.comments.length < data.allCount && this.offset + 10 < data.allCount) this.offset += 10;
        else this.offset = data.allCount;

        this.proccesedComment();
        this.loaderService.hide();
      })
  }

  addComment(): void {
    if (this.commentText) {
      this.commentService.addNewComment({ article: this.article.id, text: this.commentText })
        .subscribe((data: DefaultResponseType) => {
          if (!data.error) {
            this.loadArticle();
            this.commentText = '';
          }
          this._snackBar.open(data.message);
        })
    } else {
      this._snackBar.open('Напишите Ваш комментарий');
    }
  }

  addActionToComment(commentId: string, action: string): void {
    if (this.isLogged) {
      this.commentService.addNewCommentAction({ commentId, action })
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (!data.error) {
              if (action === 'like' || action === 'dislike') {
                this.comments.map(comment => {
                  if (comment.id === commentId && !comment.userAction) {
                    if (action === 'like') comment.likesCount++;
                    if (action === 'dislike') comment.dislikesCount++;
                  } else if (comment.id === commentId && comment.userAction && action !== comment.userAction) {
                    action === 'like' ? comment.likesCount++ : comment.likesCount--;
                    action === 'like' ? comment.dislikesCount-- : comment.dislikesCount++;
                  }
                  comment.userAction = action
                })
                this._snackBar.open('Ваш голос учтен');
              } else {
                this._snackBar.open('Жалоба отправлена');
              }
            }
          },
          error: (error) => {
            if (error.status === 400) this._snackBar.open('Жалоба уже отправлена');
            else this._snackBar.open('Произошла ошибка');
          }
        })
    }
  }
}
