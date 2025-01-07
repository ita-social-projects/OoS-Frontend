import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerErrorService {
  constructor(private readonly http: HttpClient) {}

  public checkHealth(): Observable<{ status: string }> {
    return this.http.get<{ status: string }>('/healthz/active').pipe(retry(2));
  }
}
