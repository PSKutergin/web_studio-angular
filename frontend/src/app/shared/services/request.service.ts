import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponseType } from 'src/app/types/default-response.type';
import { RequestType } from 'src/app/types/request.type';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  createNewRequest(data: RequestType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', data);
  }
}
