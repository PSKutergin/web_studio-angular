import { Directive, ElementRef, Renderer2, forwardRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[phoneMask]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneMaskDirective),
      multi: true
    }
  ]
})
export class PhoneMaskDirective implements ControlValueAccessor {
  private onChange?: (value: string) => void;
  private onTouched?: () => void;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  writeValue(value: string): void {
    if (value) {
      const formattedValue = this.formatPhoneNumber(value);
      this.renderer.setProperty(this.el.nativeElement, 'value', formattedValue);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    // Удаляем все символы, кроме цифр
    let newVal = value.replace(/\D/g, '');

    // Обрезаем до 11 символов (чтобы соответствовать формату +7 (XXX) XXX-XX-XX)
    if (newVal.length > 11) {
      newVal = newVal.slice(0, 11);
    }

    let formattedValue = this.formatPhoneNumber(newVal);

    // Обновляем значение в input
    this.renderer.setProperty(this.el.nativeElement, 'value', formattedValue);

    // Передаем только числовое значение в форму (без форматирования)
    if (this.onChange) {
      this.onChange(newVal);
    }
  }

  @HostListener('blur')
  onBlur(): void {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  private formatPhoneNumber(value: string): string {
    let formattedValue = '+7 ';

    if (value.length > 1) {
      formattedValue += `(${value.slice(1, 4)})`;
    }

    if (value.length >= 5) {
      formattedValue += ` ${value.slice(4, 7)}`;
    }

    if (value.length >= 8) {
      formattedValue += `-${value.slice(7, 9)}`;
    }

    if (value.length >= 10) {
      formattedValue += `-${value.slice(9, 11)}`;
    }

    return formattedValue;
  }
}
