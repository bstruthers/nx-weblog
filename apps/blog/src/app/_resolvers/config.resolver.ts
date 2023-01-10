import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable, of, switchMap } from 'rxjs';

import * as YAML from 'yaml';

@Injectable({
  providedIn: 'root',
})
export class ConfigResolver implements Resolve<Record<string, string>> {
  constructor(private http: HttpClient) {}

  resolve(): Observable<Record<string, string>> {
    return this.http.get('/assets/config.yaml', { responseType: 'text' }).pipe(
      switchMap((config) => {
        return of(YAML.parse(config));
      })
    );
  }
}
