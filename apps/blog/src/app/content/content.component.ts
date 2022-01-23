import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'nx-weblog-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  content = ''

  constructor(private http: HttpClient, private route: ActivatedRoute, private changeDetectionRef: ChangeDetectorRef) { }
  
  ngOnInit(): void {
    this.route.data.pipe(
      switchMap((d: Data) => {
        return this.http.get(`/assets/${d['content']}.md`, { responseType: 'text' });
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
