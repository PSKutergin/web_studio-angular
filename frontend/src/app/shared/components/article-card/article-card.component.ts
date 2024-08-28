import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleType } from 'src/app/types/article.type';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit {

  @Input() article!: ArticleType;
  serverStaticPath = environment.serverStaticPath;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigate(): void {
    this.router.navigate(['/article/', this.article.url]);
  }

}
