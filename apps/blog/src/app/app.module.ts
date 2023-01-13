import { NgModule, SecurityContext } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

import { ContentResolver } from './_resolvers/content.resolver';
import { StructureResolver } from './_resolvers/structure.resolver';
import { ConfigResolver } from './_resolvers/config.resolver';

import { AppComponent } from './app.component';
import { ContentComponent } from './content/content.component';
import { BlogComponent } from './blog/blog.component';

@NgModule({
  declarations: [AppComponent, ContentComponent, BlogComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          gfm: true,
          breaks: true,
          pedantic: false,
          smartLists: true,
          smartypants: true,
        },
      },
      sanitize: SecurityContext.NONE,
    }),
    RouterModule.forRoot(
      [
        {
          path: '',
          component: BlogComponent,
          resolve: {
            config: ConfigResolver,
            structure: StructureResolver,
          },
          children: [
            {
              path: '',
              component: ContentComponent,
              data: { contentFile: 'home' },
              resolve: {
                content: ContentResolver,
              },
            },
            {
              path: 'home',
              redirectTo: '/',
            },
            {
              path: 'about',
              component: ContentComponent,
              data: { contentFile: 'about' },
              resolve: {
                content: ContentResolver,
              },
            },
            {
              path: 'posts/:year/:month/:slug',
              component: ContentComponent,
              resolve: {
                content: ContentResolver,
              },
            },
            {
              path: 'posts/:year/:month/:day/:slug',
              component: ContentComponent,
              resolve: {
                content: ContentResolver,
              },
            },
            {
              path: 'archived',
              children: [
                {
                  path: '**',
                  component: ContentComponent,
                  data: { contentFile: 'archived' },
                  resolve: {
                    content: ContentResolver,
                  },
                },
              ],
            },
            {
              path: 'posts/:slug',
              component: ContentComponent,
              resolve: {
                content: ContentResolver,
              },
            },
            {
              path: 'tags/:tag',
              component: ContentComponent,
              resolve: {
                content: ContentResolver,
              },
            },
            {
              path: '**',
              component: ContentComponent,
              data: { contentFile: 'not-found' },
              resolve: {
                content: ContentResolver,
              },
            },
          ],
        },
      ],
      { scrollPositionRestoration: 'enabled' }
    ),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
