import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ArticleService } from 'src/app/shared/services/article.service';
import { ArticleType } from 'src/app/types/article.type';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  article!: ArticleType;
  serverStaticPath = environment.serverStaticPath;
  isLogged: boolean = false;
  commentText: string = '';

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private articleService: ArticleService) { }

  ngOnInit(): void {
    this.isLogged = this.authService.getIsLoggedIn();

    this.activatedRoute.params.subscribe((params) => {
      this.articleService.getArticle(params['url'])
        .subscribe((data: ArticleType) => {
          this.article = data;
        })
    })
  }

}
