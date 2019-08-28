import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  searchInput = '';
  title = 'first-angular-app';

  constructor() {}

  updateParagraph(input) {
    this.searchInput = input;
  }
}
