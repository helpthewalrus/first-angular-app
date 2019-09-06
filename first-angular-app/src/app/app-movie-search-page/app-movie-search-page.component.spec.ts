import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AppMovieSearchPageComponent } from "./app-movie-search-page.component";

describe("AppMovieSearchPageComponent", () => {
  let component: AppMovieSearchPageComponent;
  let fixture: ComponentFixture<AppMovieSearchPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppMovieSearchPageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppMovieSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
