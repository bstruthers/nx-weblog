import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Data } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { MarkdownModule } from 'ngx-markdown';
import { BehaviorSubject } from 'rxjs';

import { AnchorService } from '../anchor.service';

import { BlogComponent } from './blog.component';

describe('BlogComponent', () => {
  let component: BlogComponent;
  let fixture: ComponentFixture<BlogComponent>;

  const dataSubject$ = new BehaviorSubject<Data>({});

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MarkdownModule.forRoot()],
      declarations: [BlogComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: dataSubject$.asObservable(),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the title, header, sidebar, and footer content', () => {
    const title = TestBed.inject(Title);
    jest.spyOn(title, 'setTitle');

    dataSubject$.next({
      config: {
        title: 'title',
      },
      structure: {
        header: 'header',
        sidebar: 'sidebar',
        footer: 'footer',
      },
    });

    expect(title.setTitle).toHaveBeenCalledWith('title');
    expect(component.header).toBe('header');
    expect(component.sidebar).toBe('sidebar');
    expect(component.footer).toBe('footer');
  });

  it('should use the anchor service to handle click events', () => {
    const anchorsAway = TestBed.inject(AnchorService);
    jest.spyOn(anchorsAway, 'interceptClick');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    component.onDocumentClick({});

    expect(anchorsAway.interceptClick).toHaveBeenCalledWith({});
  });
});
