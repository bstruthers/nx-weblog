import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  convertToParamMap,
  Data,
  ParamMap,
} from '@angular/router';

import { MarkdownModule } from 'ngx-markdown';
import { BehaviorSubject } from 'rxjs';

import { AnchorService } from '../anchor.service';

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

  it('should combine the content title with the existing title', () => {
    const title = TestBed.inject(Title);
    jest.spyOn(title, 'setTitle');
    jest.spyOn(title, 'getTitle').mockReturnValue('Get Title');

    dataSubject$.next({ content: '# Content Title' });

    expect(title.setTitle).toHaveBeenCalledWith('Content Title — Get Title');
  });

  it('should not combine the content title with the existing title when there is no title', () => {
    const title = TestBed.inject(Title);
    jest.spyOn(title, 'setTitle');
    jest.spyOn(title, 'getTitle').mockReturnValue('Get Title');

    dataSubject$.next({ content: 'Not a Content Title' });

    expect(title.setTitle).not.toHaveBeenCalled();
  });

  it('should use the anchor service to handle click events', () => {
    const anchorsAway = TestBed.inject(AnchorService);
    jest.spyOn(anchorsAway, 'interceptClick');

    // @ts-ignore
    component.onDocumentClick({});

    expect(anchorsAway.interceptClick).toHaveBeenCalledWith({});
  });

  // it('should pull the content from the route to determine which content to render', () => {
  //   dataSubject$.next({ content: 'content-file' });

  //   const contentRequest = httpMock.expectOne('/assets/content-file.md');
  //   contentRequest.flush('# content.md');

  //   expect(component.content).toBe('# content.md');
  // });

  // it('should use the slug on the route to determine which content to render', () => {
  //   paramsSubject$.next(convertToParamMap({ slug: 'slug' }));

  //   const contentRequest = httpMock.expectOne('/assets/posts/slug.md');
  //   contentRequest.flush('# slug.md');

  //   expect(component.content).toBe('# slug.md');
  // });

  // it('should redirect to the not found page when there is no content', () => {
  //   const router = TestBed.inject(Router);
  //   jest.spyOn(router, 'navigate');
  //   paramsSubject$.next(convertToParamMap({ slug: 'not-found' }));

  //   const contentRequest = httpMock.expectOne('/assets/posts/not-found.md');
  //   contentRequest.flush('', new HttpErrorResponse({ error: 404 }));

  //   expect(router.navigate).toHaveBeenCalledWith(['not-found']);
  // });
});
