import { NgModule, SecurityContext } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { MarkdownModule, MarkedOptions } from "ngx-markdown";

import { AppComponent } from "./app.component";
import { ContentComponent } from "./content/content.component";

@NgModule({
  declarations: [AppComponent, ContentComponent],
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
    RouterModule.forRoot([
      { path: "", component: ContentComponent, data: { content: "home" } },
      {
        path: "about",
        component: ContentComponent,
        data: { content: "about" },
      },
      { path: "posts/:slug", component: ContentComponent },
      {
        path: "**",
        component: ContentComponent,
        data: { content: "not-found" },
      },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
