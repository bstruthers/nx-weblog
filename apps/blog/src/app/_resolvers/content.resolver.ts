import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContentResolver implements Resolve<string> {
  constructor(private http: HttpClient, private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<string> {
    let content = route.data['contentFile'];

    if (route.paramMap.has('slug')) {
      content = `posts/${route.paramMap.get('slug')}`;
    }

    return this.http
      .get(`/assets/content/${content}.md`, { responseType: 'text' })
      .pipe(
        catchError(() => {
          this.router.navigate(['not-found']);
          return '';
        })
      );
  }
}
