import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

import * as YAML from 'yaml';

@Component({
  selector: 'nx-weblog-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private titleService: Title) {}

  ngOnInit(): void {
    this.http.get('/assets/config.yaml', { responseType: 'text' }).subscribe(response => {
      const parsed = YAML.parse(response);
      this.titleService.setTitle(parsed.title);
    });
  }
}
