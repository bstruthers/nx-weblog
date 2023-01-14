import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  convertToParamMap,
  Router,
  UrlSegment,
} from '@angular/router';

import { ContentResolver } from './content.resolver';

describe('ContentResolver', () => {
  let resolver: ContentResolver;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpMock = TestBed.inject(HttpTestingController);
    resolver = TestBed.inject(ContentResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should get post content when there is a year, month, day, and slug', () => {
    const route = new ActivatedRouteSnapshot();
    route.data = {
      contentFile: '',
    };
    route.params = {
      year: '2023',
      month: '01',
      day: '14',
      slug: 'testing',
    };

    resolver.resolve(route).subscribe((content) => {
      expect(content).toBe('# post');
    });

    const request = httpMock.expectOne(
      '/assets/content/posts/2023/01/14/testing.md'
    );
    request.flush('# post');

    httpMock.verify();
  });

  it('should get post content when there is a year, month, and slug', () => {
    const route = new ActivatedRouteSnapshot();
    route.data = {
      contentFile: '',
    };
    route.params = {
      year: '2023',
      month: '01',
      slug: 'testing',
    };

    resolver.resolve(route).subscribe((content) => {
      expect(content).toBe('# post');
    });

    const request = httpMock.expectOne(
      '/assets/content/posts/2023/01/testing.md'
    );
    request.flush('# post');

    httpMock.verify();
  });

  it('should get post content when there is just a slug', () => {
    const route = new ActivatedRouteSnapshot();
    route.data = {
      contentFile: '',
    };
    route.params = {
      slug: 'testing',
    };

    resolver.resolve(route).subscribe((content) => {
      expect(content).toBe('# post');
    });

    const request = httpMock.expectOne('/assets/content/posts/testing.md');
    request.flush('# post');

    httpMock.verify();
  });

  it('should get tag content', () => {
    const route = new ActivatedRouteSnapshot();
    route.data = {
      contentFile: '',
    };
    route.params = {
      tag: 'tag',
    };

    resolver.resolve(route).subscribe((content) => {
      expect(content).toBe('# tag');
    });

    const request = httpMock.expectOne('/assets/content/tags/tag.md');
    request.flush('# tag');

    httpMock.verify();
  });

  it('should get archived content', () => {
    const route = new ActivatedRouteSnapshot();
    route.data = {
      contentFile: 'archived',
    };
    route.url = [
      new UrlSegment('weblog', {}),
      new UrlSegment('2009', {}),
      new UrlSegment('01', {}),
      new UrlSegment('old-post', {}),
    ];

    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockImplementation();

    resolver.resolve(route).subscribe((content) => {
      expect(content).toBe('# archived');
    });

    const request = httpMock.expectOne(
      '/assets/content/archived/weblog/2009/01/old-post.md'
    );
    request.flush('# archived');

    httpMock.verify();
  });

  it('should get not found content from the archive', () => {
    const route = new ActivatedRouteSnapshot();
    route.data = {
      contentFile: 'not-found',
    };
    route.url = [
      new UrlSegment('weblog', {}),
      new UrlSegment('2009', {}),
      new UrlSegment('01', {}),
      new UrlSegment('old-post', {}),
    ];

    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockImplementation();

    resolver.resolve(route).subscribe((content) => {
      expect(content).toBe('# not-found, but archived');
    });

    const request = httpMock.expectOne(
      '/assets/content/archived/weblog/2009/01/old-post.md'
    );
    request.flush('# not-found, but archived');

    httpMock.verify();
  });

  it('should handle errors', () => {
    const route = new ActivatedRouteSnapshot();
    route.data = {
      contentFile: '',
    };
    route.params = {
      tag: 'tag',
    };

    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockImplementation();

    resolver.resolve(route).subscribe((content) => {
      expect(content).toBe('# not-found');
    });

    const firstRequest = httpMock.expectOne('/assets/content/tags/tag.md');
    firstRequest.flush('', {
      status: 404,
      statusText: 'Not Found',
    });

    const notFoundRequest = httpMock.expectOne('/assets/content/not-found.md');
    notFoundRequest.flush('# not-found');
  });
});
