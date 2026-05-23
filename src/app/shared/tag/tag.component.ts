import { Component, input, computed } from '@angular/core';

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
