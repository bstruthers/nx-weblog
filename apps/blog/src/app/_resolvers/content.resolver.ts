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

    // Route didn't match, the content is set to not-found.
    // Check if the content may have been something that was
    // archived.
    if (content === 'not-found') {
      // Try to get the content from the archives
      return this.getContent(
        `/assets/content/archived/${route.url.join('/').toLowerCase()}.md`
      );
    }

    // If going to the archives, content is set to archived.
    if (content === 'archived') {
      content = `archived/${route.url.join('/').toLowerCase()}`;
    } else if (
      route.paramMap.has('year') &&
      route.paramMap.has('month') &&
      route.paramMap.has('day') &&
      route.paramMap.has('slug')
    ) {
      content = `posts/${route.paramMap.get('year')}/${route.paramMap.get(
        'month'
      )}/${route.paramMap.get('day')}/${route.paramMap.get('slug')}`;
    } else if (
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

    return this.getContent(`/assets/content/${content}.md`);
  }

  private getContent(contentUrl: string): Observable<string> {
    return this.http.get(contentUrl, { responseType: 'text' }).pipe(
      catchError(() => {
        return this.http.get('/assets/content/not-found.md', {
          responseType: 'text',
        });
      })
    );
  }
}
