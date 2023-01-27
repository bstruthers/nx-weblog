import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ActivatedRoute, Data } from '@angular/router';

import { MarkdownModule } from 'ngx-markdown';
import { BehaviorSubject } from 'rxjs';

import { AnchorService } from '../anchor.service';

import { ContentComponent } from './content.component';

describe('ContentComponent', () => {
  let fixture: ComponentFixture<ContentComponent>;
  let component: ContentComponent;

  const dataSubject$ = new BehaviorSubject<Data>({});
  const parentDataSubject$ = new BehaviorSubject<Data>({
    config: {
      title: 'Base Title',
    },
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownModule.forRoot()],
      declarations: [ContentComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: dataSubject$.asObservable(),
            parent: {
              data: parentDataSubject$.asObservable(),
            },
          },
        },
        {
          provide: DomSanitizer,
          useValue: {
            sanitize: () => 'safeString',
            bypassSecurityTrustHtml: () => 'safeString',
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should combine the content title with the base title', () => {
    const title = TestBed.inject(Title);
    jest.spyOn(title, 'setTitle');

    dataSubject$.next({
      content: '# Content Title',
    });

    expect(title.setTitle).toHaveBeenCalledWith('Content Title — Base Title');
  });

  it('should not combine the content title with the base title when there is no title', () => {
    const title = TestBed.inject(Title);
    jest.spyOn(title, 'setTitle');

    dataSubject$.next({
      content: 'Not a Content Title',
    });

    expect(title.setTitle).not.toHaveBeenCalled();
  });

  it('should use the anchor service to handle click events', () => {
    const anchorsAway = TestBed.inject(AnchorService);
    jest.spyOn(anchorsAway, 'interceptClick');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    component.onDocumentClick({});

    expect(anchorsAway.interceptClick).toHaveBeenCalledWith({});
  });
});
