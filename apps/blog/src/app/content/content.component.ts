import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { catchError, combineLatest, of, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'nx-weblog-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  content = ''

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private changeDetectionRef: ChangeDetectorRef) { }
  
  ngOnInit(): void {
    combineLatest([
      this.route.data,
      this.route.paramMap
    ]).pipe(
      switchMap(([d, p]: [Data, ParamMap]) => {
        let content = d['content'];

        if (p.has('slug')) {
          content = `posts/${p.get('slug')}`
        }

        return this.http.get(`/assets/${content}.md`, { responseType: 'text' })
          .pipe(
            catchError(() => {
              this.router.navigate(['not-found'])
              return '';
            })
          );
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe(content => {
      this.content = content;
      this.changeDetectionRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
