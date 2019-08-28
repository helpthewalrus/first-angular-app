import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent {
  @Output() onAdd: EventEmitter<string> = new EventEmitter()
  inputValue = '';

  constructor() { }

  addSearchInput() {
    if (this.inputValue.trim()) {
      const searchInput = this.inputValue;
      this.onAdd.emit(searchInput);
      this.inputValue = '';
    }
  }
}
