import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FilmsToWatchPageComponent } from "./films-to-watch-page.component";

describe("FilmsToWatchPageComponent", () => {
    let component: FilmsToWatchPageComponent;
    let fixture: ComponentFixture<FilmsToWatchPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FilmsToWatchPageComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FilmsToWatchPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
