import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AppComponent } from './app.component';
import { Title } from '@angular/platform-browser';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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

  it('should pull the configuration file and set the title on init', () => {
    const titleService = TestBed.inject(Title);
    jest.spyOn(titleService, 'setTitle');

    const httpRequest = httpMock.expectOne('/assets/config.yaml');
    httpRequest.flush('title: Hello, there');
    httpMock.verify();

    expect(titleService.setTitle).toHaveBeenCalledWith('Hello, there');
  });
});
