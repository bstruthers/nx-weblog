import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { combineLatest, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StructureResolver implements Resolve<Record<string, string>> {
  constructor(private http: HttpClient) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Record<string, string>> {
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
