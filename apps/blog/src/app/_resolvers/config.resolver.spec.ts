import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ConfigResolver } from './config.resolver';

describe('ConfigResolver', () => {
  let resolver: ConfigResolver;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpMock = TestBed.inject(HttpTestingController);
    resolver = TestBed.inject(ConfigResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should get the config', () => {
    resolver.resolve().subscribe((c) => {
      expect(c).toBe({ key: 'value' });
    });

    const request = httpMock.expectOne('/assets/config.yaml');
    request.flush(`key: 'value'`);

    httpMock.verify();
  });
});
