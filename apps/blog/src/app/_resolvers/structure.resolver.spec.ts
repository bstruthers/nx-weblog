import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { StructureResolver } from './structure.resolver';

describe('StructureResolver', () => {
  let resolver: StructureResolver;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpMock = TestBed.inject(HttpTestingController);
    resolver = TestBed.inject(StructureResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should get the structure', () => {
    resolver.resolve().subscribe((structure) => {
      expect(structure['header']).toBe('# header');
      expect(structure['sidebar']).toBe('# sidebar');
      expect(structure['footer']).toBe('# footer');
    });

    const headerRequest = httpMock.expectOne('/assets/content/header.md');
    headerRequest.flush('# header');

    const sidebarRequest = httpMock.expectOne('/assets/content/sidebar.md');
    sidebarRequest.flush('# sidebar');

    const footerRequest = httpMock.expectOne('/assets/content/footer.md');
    footerRequest.flush('# footer');

    httpMock.verify();
  });
});
