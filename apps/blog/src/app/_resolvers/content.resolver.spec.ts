import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

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

  it('should get post data when there is a year, month, and slug', () => {
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

  it('should get post data when there is just a slug', () => {
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

  it('should get tag data', () => {
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
      expect(content).toBe('');
    });

    const request = httpMock.expectOne('/assets/content/tags/tag.md');
    request.flush('', {
      status: 404,
      statusText: 'Not Found',
    });

    expect(router.navigate).toHaveBeenCalledWith(['not-found']);
  });
});
