import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[nameValidation]'
})
export class NameValidationDirective {
  private inputElement: HTMLInputElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.inputElement = this.el.nativeElement;
  }

  @HostListener('input') onInput() {
    this.validateName();
  }

  private validateName(): void {
    const parentNode = this.inputElement.parentNode;
    const errorMessage = (parentNode as HTMLElement).querySelector('.error-message');
    if (errorMessage) {
      (parentNode as HTMLElement).removeChild(errorMessage);
    }
    this.inputElement.classList.remove('invalid');

    let inputValue = this.inputElement.value.toLowerCase();

    // Преобразуем каждое слово в верхний регистр
    inputValue = inputValue.replace(/( |^)[а-яёa-z]/g, function (x) { return x.toUpperCase(); });
    // inputValue = inputValue.replace(/\b\w/g, (match) => match.toUpperCase());

    // Удаляем невалидные символы, кроме пробелов
    inputValue = inputValue.replace(/[^А-ЯЁа-яё\s-]/g, '');

    // Ограничиваем ввод не более трех слов
    if (inputValue.trim().split(/\s+/).length > 3) {
      inputValue = inputValue.split(/\s+/).slice(0, 3).join(' ');
    }

    this.inputElement.value = inputValue;
  }
}
