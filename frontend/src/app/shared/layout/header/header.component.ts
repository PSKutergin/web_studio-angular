import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserInfoType } from 'src/app/types/user-info.type';
import { UserService } from '../../services/user.service';
import { DefaultResponseType } from 'src/app/types/default-response.type';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLogged: boolean = false;
  userInfo: UserInfoType | null = null;

  constructor(private authService: AuthService, private userService: UserService) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.authService.isLogged$
      .subscribe((isLogged: boolean) => {
        console.log('isLogged:', isLogged);
        this.isLogged = isLogged;

        if (this.isLogged) {
          this.userService.getUserInfo()
            .subscribe((data: UserInfoType | DefaultResponseType) => {
              if ((data as DefaultResponseType).error !== undefined) {
                throw new Error((data as DefaultResponseType).message);
              }

              console.log(data);

              this.userInfo = data as UserInfoType;
            });
        }
      });
  }
}
