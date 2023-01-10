import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContentResolver implements Resolve<string> {
  constructor(private http: HttpClient, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<string> {
    let content = route.data['contentFile'];

    if (
      route.paramMap.has('year') &&
      route.paramMap.has('month') &&
      route.paramMap.has('slug')
    ) {
      content = `posts/${route.paramMap.get('year')}/${route.paramMap.get(
        'month'
      )}/${route.paramMap.get('slug')}`;
    } else if (route.paramMap.has('slug')) {
      content = `posts/${route.paramMap.get('slug')}`;
    } else if (route.paramMap.has('tag')) {
      content = `tags/${route.paramMap.get('tag')}`;
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
