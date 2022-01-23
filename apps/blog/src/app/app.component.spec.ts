import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { AppComponent } from './app.component';
import { Title } from '@angular/platform-browser';
import { MarkdownModule } from 'ngx-markdown';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MarkdownModule.forRoot()],
      declarations: [AppComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should request the configuration file and structural content, and set the title and content on init', () => {
    const titleService = TestBed.inject(Title);
    jest.spyOn(titleService, 'setTitle');

    const configRequest = httpMock.expectOne('/assets/config.yaml');
    configRequest.flush('title: Hello, there');

    const headerRequest = httpMock.expectOne('/assets/header.md');
    headerRequest.flush('# header.md');

    const sidebareRequest = httpMock.expectOne('/assets/sidebar.md');
    sidebareRequest.flush('# sidebar.md');

    const footerRequest = httpMock.expectOne('/assets/footer.md');
    footerRequest.flush('# footer.md');

    httpMock.verify();

    expect(component.title).toBe('Hello, there');
    expect(titleService.setTitle).toHaveBeenCalledWith('Hello, there');
    expect(component.header).toBe('# header.md');
    expect(component.sidebar).toBe('# sidebar.md');
    expect(component.footer).toBe('# footer.md');
  });
});
