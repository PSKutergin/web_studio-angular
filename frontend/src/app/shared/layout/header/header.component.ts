import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserInfoType } from 'src/app/types/user-info.type';
import { UserService } from '../../services/user.service';
import { DefaultResponseType } from 'src/app/types/default-response.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLogged: boolean = false;
  userInfo: UserInfoType | null = null;
  isProfileVisible: boolean = false;

  @ViewChild('headerBtn') headerBtn!: ElementRef;
  @ViewChild('headerProfile') headerProfile!: ElementRef;

  constructor(
    private elementRef: ElementRef,
    private authService: AuthService,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.authService.isLogged$
      .subscribe((isLogged: boolean) => {
        this.isLogged = isLogged;

        if (this.isLogged) {
          this.userService.getUserInfo()
            .subscribe((data: UserInfoType | DefaultResponseType) => {
              if ((data as DefaultResponseType).error !== undefined) {
                throw new Error((data as DefaultResponseType).message);
              }

              this.userInfo = data as UserInfoType;
            });
        }
      });
  }

  toggleProfile(event: Event) {
    this.isProfileVisible = !this.isProfileVisible;

    if (this.isProfileVisible) {
      setTimeout(() => {
        const btnWidth = this.headerBtn.nativeElement.offsetWidth;
        this.headerProfile.nativeElement.style.width = `${btnWidth}px`;
      }, 0);
    }

    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;

    if (this.elementRef.nativeElement.contains(targetElement)) {
      this.isProfileVisible = false;
    }
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();
        },
        error: () => {
          this.doLogout();
        }
      });
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из аккаунта');
    this.router.navigate(['/']);
  }
}
