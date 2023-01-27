import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Data } from '@angular/router';

import { combineLatest, Subject, takeUntil } from 'rxjs';

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
    private titleService: Title,
    private changeDetectionRef: ChangeDetectorRef,
    private anchorService: AnchorService
  ) {}

  ngOnInit(): void {
    combineLatest([
      // @ts-expect-error 2341
      this.route.parent.data,
      this.route.data,
    ])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((routeData: [Data, Data]) => {
        const parentData = routeData[0];
        const data = routeData[1];

        const baseTitle = parentData['config'].title;
        this.content = data['content'];

        // Update the title with the header of the content
        const split = this.content.split('\n');
        if (split.length && split[0].startsWith('# ')) {
          this.titleService.setTitle(
            `${split[0].replace('# ', '')} — ${baseTitle}`
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
