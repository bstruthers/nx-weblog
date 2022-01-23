import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

import * as YAML from 'yaml';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'nx-weblog-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = '';
  header = '';
  sidebar = '';
  footer = '';

  constructor(
    private http: HttpClient,
    private titleService: Title,
    private changeDetectionRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    combineLatest([
      this.http.get('/assets/config.yaml', { responseType: 'text' }),
      this.http.get('/assets/header.md', { responseType: 'text' }),
      this.http.get('/assets/sidebar.md', { responseType: 'text' }),
      this.http.get('/assets/footer.md', { responseType: 'text' }),
    ]) .subscribe(([config, header, sidebar, footer]) => {
      const parsed = YAML.parse(config);
      this.title = parsed.title;
      this.titleService.setTitle(this.title);

      this.header = header;
      this.sidebar = sidebar;
      this.footer = footer;

      this.changeDetectionRef.detectChanges();
    });
  }
}
