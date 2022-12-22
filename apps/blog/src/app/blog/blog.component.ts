import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';
import { AnchorService } from '../anchor.service';

@Component({
  selector: 'nx-weblog-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  title = '';
  header = '';
  sidebar = '';
  footer = '';

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private changeDetectionRef: ChangeDetectorRef,
    private anchorService: AnchorService
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      this.title = data['config'].title;
      this.titleService.setTitle(this.title);

      this.header = data['structure'].header;
      this.sidebar = data['structure'].sidebar;
      this.footer = data['structure'].footer;

      this.changeDetectionRef.detectChanges();
    });
  }

  @HostListener('click', ['$event'])
  onDocumentClick(event: Event) {
    this.anchorService.interceptClick(event);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
