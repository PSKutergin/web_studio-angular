import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { PhoneMaskDirective } from './directives/phone-mask.directive';
import { NameValidationDirective } from './directives/name-validation.directive';

@NgModule({
  declarations: [
    ArticleCardComponent,
    PhoneMaskDirective,
    NameValidationDirective,
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    PhoneMaskDirective,
    NameValidationDirective,
    ArticleCardComponent
  ]
})
export class SharedModule { }
