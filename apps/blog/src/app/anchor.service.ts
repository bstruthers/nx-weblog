import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';

// Use Angular routing when possible.
// https://github.com/jfcere/ngx-markdown/issues/125
@Injectable({
  providedIn: 'root',
})
export class AnchorService {
  constructor(private route: ActivatedRoute, private router: Router) {}

  isExternalUrl(href: string | null): boolean {
    return (
      !href ||
      href.startsWith('http:') ||
      href.startsWith('https:') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:')
    );
  }

  stripQuery(url: string): string {
    const query = /[^?]*/.exec(url);
    return query ? query[0] : '';
  }

  stripFragmentAndQuery(url: string): string {
    const fragment = /[^#]*/.exec(url);
    return this.stripQuery(fragment ? fragment[0] : '');
  }

  getUrlTree(url: string): UrlTree {
    const urlPath =
      this.stripFragmentAndQuery(url) ||
      this.stripFragmentAndQuery(this.router.url);
    const parsedUrl = this.router.parseUrl(url);
    const fragment = parsedUrl.fragment || undefined;
    const queryParams = parsedUrl.queryParams;

    return this.router.createUrlTree([urlPath], {
      relativeTo: this.route,
      fragment,
      queryParams,
    });
  }

  navigate(url: string, replaceUrl: boolean) {
    const urlTree = this.getUrlTree(url);

    this.router.navigated = false;
    this.router.navigateByUrl(urlTree, { replaceUrl });
  }

  interceptClick(event: Event) {
    const element = event.target;
    if (!(element instanceof HTMLAnchorElement)) {
      return;
    }

    const href = element.getAttribute('href');
    if (this.isExternalUrl(href)) {
      return;
    }

    this.navigate(`/${href}`, false);
    event.preventDefault();
  }
}
