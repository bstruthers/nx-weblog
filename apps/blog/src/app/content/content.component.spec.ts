import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Data } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { BehaviorSubject } from 'rxjs';

import { ContentComponent } from './content.component';

describe('ContentComponent', () => {
  let fixture: ComponentFixture<ContentComponent>;
  let component: ContentComponent;
  let httpMock: HttpTestingController;

  let dataSubject$ = new BehaviorSubject<Data>({ content: 'content-file' });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MarkdownModule.forRoot()],
      declarations: [ ContentComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: dataSubject$.asObservable()
          }
        }
      ]
    })
    .compileComponents();
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

  it('should pull the content from the route to determine which content to render', () => {
    const contentRequest = httpMock.expectOne('/assets/content-file.md');
    contentRequest.flush('# content.md');

    httpMock.verify();

    expect(component.content).toBe('# content.md');

  });
});
