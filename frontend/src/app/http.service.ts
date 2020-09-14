import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class HttpService {
  constructor(private http: HttpClient) {
  }

  postSignature(signatureData): Observable<any> {
    return this.http.post('https://localhost:5001/TicketStall/SaveSignature', signatureData);
  }
}
