import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { PhoneMaskDirective } from './directives/phone-mask.directive';

@NgModule({
  declarations: [
    ArticleCardComponent,
    PhoneMaskDirective,
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    PhoneMaskDirective,
    ArticleCardComponent
  ]
})
export class SharedModule { }
