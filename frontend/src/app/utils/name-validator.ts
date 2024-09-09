import { AbstractControl, ValidatorFn } from '@angular/forms';

export function nameValidator(): ValidatorFn {
    return (control: AbstractControl) => {
        if (!control.value) {
            return null; // Не валидируем пустые значения, так как они обязательны для ввода
        }

        const value = control.value;
        const regex = /^[А-ЯЁ][а-яё]*([\s-][А-ЯЁ][а-яё]*){0,2}$/; // Пример регулярного выражения для проверки
        const isValid = regex.test(value);

        return isValid ? null : { invalidName: true };
    };
}
