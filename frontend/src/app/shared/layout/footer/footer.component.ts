import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  successOrder: boolean = false;

  orderForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)]],
  });

  constructor(private dialog: MatDialog, private fb: FormBuilder, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  get name() {
    return this.orderForm.get('name');
  }

  get phone() {
    return this.orderForm.get('phone');
  }

  @ViewChild('popup') popup!: TemplateRef<ElementRef>;
  dialogRef: MatDialogRef<any> | null = null;

  openPopup(): void {
    this.dialogRef = this.dialog.open(this.popup);
  }

  closePopup(): void {
    this.dialogRef?.close();
    this.orderForm.reset();
    this.successOrder = false;
  }

  sendOrder(): void {
    if (this.orderForm.valid) {
      this.successOrder = true;
    } else {
      this.orderForm.markAllAsTouched();
      this._snackBar.open('Заполните все обязательные поля');
    }
  }
}
