import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { combineLatest, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StructureResolver implements Resolve<Record<string, string>> {
  constructor(private http: HttpClient) {}

  resolve(): Observable<Record<string, string>> {
    return combineLatest([
      this.http.get('/assets/content/header.md', { responseType: 'text' }),
      this.http.get('/assets/content/sidebar.md', { responseType: 'text' }),
      this.http.get('/assets/content/footer.md', { responseType: 'text' }),
    ]).pipe(
      switchMap(([header, sidebar, footer]) => {
        return of({
          header: header,
          sidebar: sidebar,
          footer: footer,
        });
      })
    );
  }
}
