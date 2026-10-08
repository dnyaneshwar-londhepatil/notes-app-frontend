import { Component, inject, output } from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ModalService } from '../../../services/modal/modal.service';
import { AddNotesComponent } from '../add-notes/add-notes.component';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-search-notes',
  imports: [ButtonComponent],
  templateUrl: './search-notes.component.html',
  styleUrl: './search-notes.component.scss',
})
export class SearchNotesComponent {
  public modalService = inject(ModalService);

  public authService = inject(AuthService);

  public emittedCategory = output<string>();

  public emittedSearch = output<string>();

  public activeCategory: string = 'all';

  public openNewNote() {
    this.modalService.open(AddNotesComponent, {
      size: 'lg',
    });
  }

  public handleNotesByCategory(category: string) {
    this.activeCategory = category;
    this.emittedCategory.emit(category);
    // Implement the logic to filter notes based on the selected category
  }

  public handleSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.emittedSearch.emit(input.value);
  }

  public logout() {
    // Implement logout logic here, such as clearing authentication tokens and redirecting to the login page
    this.authService.logout();
  }
}
