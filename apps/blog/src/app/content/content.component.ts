import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { AnchorService } from '../anchor.service';

@Component({
  selector: 'nx-weblog-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  content = '';

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private changeDetectionRef: ChangeDetectorRef,
    private anchorService: AnchorService
  ) {}

  ngOnInit(): void {
    this.route.data.pipe(takeUntil(this.unsubscribe$)).subscribe((d) => {
      this.content = d['content'];

      // Update the title with the header of the content
      const split = this.content.split('\n');
      if (split.length && split[0].startsWith('# ')) {
        this.title.setTitle(
          `${split[0].replace('# ', '')} — ${this.title.getTitle()}`
        );
      }

      this.changeDetectionRef.markForCheck();
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
