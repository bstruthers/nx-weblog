import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import * as exp from 'constants';

import { AnchorService } from './anchor.service';

describe('AnchorService', () => {
  let service: AnchorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    });
    service = TestBed.inject(AnchorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a method for determining if a url is external', () => {
    expect(service.isExternalUrl('')).toBe(true);
    expect(service.isExternalUrl('http://')).toBe(true);
    expect(service.isExternalUrl('https://')).toBe(true);
    expect(service.isExternalUrl('mailto://')).toBe(true);
    expect(service.isExternalUrl('tel://')).toBe(true);
    expect(service.isExternalUrl('/')).toBe(false);
  });

  it('should have a method to remove the query string from a url', () => {
    expect(service.stripQuery('test?query=value')).toBe('test');
    expect(service.stripQuery('test')).toBe('test');
  });

  it('should have a method to remove the fragment and query string from a url', () => {
    jest.spyOn(service, 'stripQuery');

    expect(service.stripFragmentAndQuery('test')).toBe('test');
    expect(service.stripFragmentAndQuery('test#frag')).toBe('test');

    expect(service.stripQuery).toHaveBeenCalledWith('test');
  });

  it('should have a method to get the url tree from a passed url', () => {
    jest.spyOn(service, 'stripQuery');
    jest.spyOn(service, 'stripFragmentAndQuery');

    const router = TestBed.inject(Router);
    jest.spyOn(router, 'createUrlTree');

    service.getUrlTree('/testing?query=value#anchor');

    expect(service.stripQuery).toHaveBeenCalled();
    expect(service.stripFragmentAndQuery).toHaveBeenCalled();

    expect(router.createUrlTree).toHaveBeenCalledWith(['/testing'], {
      fragment: 'anchor',
      queryParams: { query: 'value' },
      relativeTo: {},
    });

    service.getUrlTree('/testing?query=value');
    expect(router.createUrlTree).toHaveBeenCalledWith(['/testing'], {
      fragment: undefined,
      queryParams: { query: 'value' },
      relativeTo: {},
    });

    service.getUrlTree('/testing');
    expect(router.createUrlTree).toHaveBeenCalledWith(['/testing'], {
      fragment: undefined,
      queryParams: {},
      relativeTo: {},
    });
  });

  it('should have a method to get the url tree from the router url', () => {
    jest.spyOn(service, 'stripQuery');
    jest.spyOn(service, 'stripFragmentAndQuery');

    const router = TestBed.inject(Router);
    jest.spyOn(router, 'createUrlTree');
    jest.spyOn(router, 'url', 'get').mockReturnValue('/testing');
    service.getUrlTree('');

    expect(router.createUrlTree).toHaveBeenCalledWith(['/testing'], {
      fragment: undefined,
      queryParams: {},
      relativeTo: {},
    });
  });

  it('should have a method to navigate', () => {
    jest.spyOn(service, 'getUrlTree').mockReturnValue(
      // @ts-ignore
      {}
    );

    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigateByUrl');

    service.navigate('url', false);

    expect(service.getUrlTree).toHaveBeenCalledWith('url');
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      {},
      { replaceUrl: false }
    );
  });

  it('should have a method to handle a click', () => {
    jest.spyOn(service, 'navigate').mockImplementation();

    // Not an anchor
    service.interceptClick(new Event('click'));
    expect(service.navigate).not.toHaveBeenCalled();

    // Anchor thats external
    jest.spyOn(service, 'isExternalUrl').mockReturnValue(true);
    const mockEvent = {
      target: document.createElement('a'),
      preventDefault: () => {
        return;
      },
    };
    mockEvent.target.href = 'test';
    // @ts-ignore
    service.interceptClick(mockEvent);

    expect(service.isExternalUrl).toHaveBeenCalledWith('test');
    expect(service.navigate).not.toHaveBeenCalled();

    // Anchor that's internal
    jest.spyOn(service, 'isExternalUrl').mockReturnValue(false);
    // @ts-ignore
    service.interceptClick(mockEvent);

    expect(service.navigate).toHaveBeenCalledWith('/test', false);
  });
});
