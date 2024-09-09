import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[phoneMask]'
})
export class PhoneMaskDirective implements OnInit, OnDestroy {
  @Input() phoneControl!: AbstractControl;

  private sub!: Subscription;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.phoneValidate();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  private phoneValidate() {
    this.sub = this.phoneControl.valueChanges.subscribe(data => {
      let newVal = data.replace(/\D/g, '');
      let formattedValue = '+7 ';

      if (newVal.length <= 1) {
        formattedValue += `(${newVal}`;
      } else if (newVal.length <= 4) {
        formattedValue += `(${newVal.slice(0, 1)}) ${newVal.slice(1)}`;
      } else if (newVal.length <= 7) {
        formattedValue += `(${newVal.slice(0, 1)}) ${newVal.slice(1, 4)}-${newVal.slice(4)}`;
      } else {
        formattedValue += `(${newVal.slice(0, 1)}) ${newVal.slice(1, 4)}-${newVal.slice(4, 7)}-${newVal.slice(7, 9)}`;
      }

      this.phoneControl.setValue(formattedValue, { emitEvent: false });
    });
  }
}
