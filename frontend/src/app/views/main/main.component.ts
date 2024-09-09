import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ArticleService } from 'src/app/shared/services/article.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { RequestService } from 'src/app/shared/services/request.service';
import { ArticleType } from 'src/app/types/article.type';
import { CategoryType } from 'src/app/types/category.type';
import { DefaultResponseType } from 'src/app/types/default-response.type';
import { RequestType } from 'src/app/types/request.type';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  articles: ArticleType[] = [];
  categories: CategoryType[] = [];
  successOrder: boolean = false;
  errorOrder: boolean = false;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    margin: 0,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      740: {
        items: 1
      }
    },
    nav: false
  };

  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    margin: 25,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: false
  };

  reviews = [
    {
      name: 'Станислав',
      image: 'review1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Алёна',
      image: 'review2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Мария',
      image: 'review3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    }, {
      name: 'Маргарита',
      image: 'review4.png',
      text: 'Хочу поблагодарить всю команду за помощь в подборе подарка для моей мамы! Все просто в восторге от мини-сада! А самое главное, что за ним удобно ухаживать, ведь в комплекте мне дали целую инструкцию.'
    },
    {
      name: 'Елена',
      image: 'review5.png',
      text: 'Спасибо большое за мою обновлённую коллекцию суккулентов! Сервис просто на 5+: быстро, удобно, недорого. Что ещё нужно клиенту для счастья?'
    },
    {
      name: 'Сабрина',
      image: 'review6.png',
      text: 'Для меня всегда важным аспектом было наличие не только физического магазина, но и онлайн-маркета, ведь не всегда есть возможность прийти на место. Ещё нигде не встречала такого огромного ассортимента!'
    },
    {
      name: 'Виталий',
      image: 'review7.png',
      text: 'Хочу поблагодарить консультанта Ирину за помощь в выборе цветка для моей жены. Я ещё никогда не видел такого трепетного отношения к весьма непростому клиенту, которому сложно угодить! Сервис – огонь!'
    }
  ];

  @ViewChild('popup') popup!: TemplateRef<ElementRef>;
  dialogRef: MatDialogRef<any> | null = null;

  orderForm = this.fb.group({
    service: ['', [Validators.required]],
    name: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)]],
  });

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private requestService: RequestService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.articleService.getTopArticles()
      .subscribe((data: ArticleType[]) => {
        this.articles = data;
      });

    this.categoryService.getCategories()
      .subscribe((data: CategoryType[]) => {
        this.categories = data;
      });
  }

  get service() {
    return this.orderForm.get('service');
  }

  get name() {
    return this.orderForm.get('name');
  }

  get phone() {
    return this.orderForm.get('phone');
  }

  openPopup(service: string): void {
    this.orderForm.get('service')?.setValue(service);
    this.dialogRef = this.dialog.open(this.popup);
  }

  closePopup(): void {
    this.dialogRef?.close();
    this.orderForm.reset();
    this.successOrder = false;
    this.errorOrder = false;
  }

  sendOrder(): void {
    if (this.orderForm.valid) {
      const requestData = {
        ...this.orderForm.value,
        type: 'order'
      };

      this.requestService.createNewRequest(requestData as RequestType)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (!data.error) {
              this.successOrder = true;
            } else {
              this.errorOrder = true;
              this._snackBar.open(data.message);
            }
          },
          error: (error) => {
            this.errorOrder = true;
            this._snackBar.open('Произошла ошибка');
          }
        });
    } else {
      this.orderForm.markAllAsTouched();
      this._snackBar.open('Заполните все обязательные поля');
    }
  }
}
