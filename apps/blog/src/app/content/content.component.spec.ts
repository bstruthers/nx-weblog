import { HttpErrorResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  convertToParamMap,
  Data,
  ParamMap,
  Router,
} from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { BehaviorSubject } from 'rxjs';

import { ContentComponent } from './content.component';

describe('ContentComponent', () => {
  let fixture: ComponentFixture<ContentComponent>;
  let component: ContentComponent;
  let httpMock: HttpTestingController;

  let dataSubject$ = new BehaviorSubject<Data>({});
  let paramsSubject$ = new BehaviorSubject<ParamMap>(convertToParamMap({}));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MarkdownModule.forRoot()],
      declarations: [ContentComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: dataSubject$.asObservable(),
            paramMap: paramsSubject$.asObservable(),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: () => {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pull the content from the route to determine which content to render', () => {
    dataSubject$.next({ content: 'content-file' });

    const contentRequest = httpMock.expectOne('/assets/content-file.md');
    contentRequest.flush('# content.md');

    expect(component.content).toBe('# content.md');
  });

  it('should use the slug on the route to determine which content to render', () => {
    paramsSubject$.next(convertToParamMap({ slug: 'slug' }));

    const contentRequest = httpMock.expectOne('/assets/posts/slug.md');
    contentRequest.flush('# slug.md');

    expect(component.content).toBe('# slug.md');
  });

  it('should redirect to the not found page when there is no content', () => {
    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');
    paramsSubject$.next(convertToParamMap({ slug: 'not-found' }));

    const contentRequest = httpMock.expectOne('/assets/posts/not-found.md');
    contentRequest.flush('', new HttpErrorResponse({ error: 404 }));

    expect(router.navigate).toHaveBeenCalledWith(['not-found']);
  });
});
