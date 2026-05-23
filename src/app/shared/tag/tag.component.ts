import { Component, input, computed } from '@angular/core';

// type status =
//   | 'all'
//   | 'work'
//   | 'personal'
//   | 'ideas'
//   | 'others'
//   | 'important'
//   | 'urgent';

@Component({
  selector: 'app-tag',
  imports: [],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
})
export class TagComponent {
  public status = input<string>('all');

  public class = computed(() => {
    return `tag--${this.status()}`;
  });
}
