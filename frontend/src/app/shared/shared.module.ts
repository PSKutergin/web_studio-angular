import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { PhoneMaskDirective } from './directives/phone-mask.directive';
import { NameValidationDirective } from './directives/name-validation.directive';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [
    ArticleCardComponent,
    PhoneMaskDirective,
    NameValidationDirective,
    LoaderComponent,
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    PhoneMaskDirective,
    NameValidationDirective,
    ArticleCardComponent,
    LoaderComponent
  ]
})
export class SharedModule { }
