import { Component, Input } from '@angular/core';
import { PriorityPipe } from '../../../shared/pipes/priority.pipe';
import { CommonModule } from '@angular/common';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';
import { Todo } from '../models/todo.model';

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [PriorityPipe, CommonModule, HighlightDirective],
  template: `
    <div
      class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-400"
      [appHighlight]="todo.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'transparent'"
      [appHighlightDelay]="todo.priority === 'high' ? 500 : 0"
    >
      <div class="flex justify-between items-start mb-2">
        <h4 class="font-medium text-gray-900">{{ todo.title }}</h4>
        <span
          class="px-2 py-1 text-xs font-semibold rounded-full"
          [class.bg-red-100]="todo.priority === 'high'"
          [class.text-red-800]="todo.priority === 'high'"
          [class.bg-yellow-100]="todo.priority === 'medium'"
          [class.text-yellow-800]="todo.priority === 'medium'"
          [class.bg-green-100]="todo.priority === 'low'"
          [class.text-green-800]="todo.priority === 'low'"
        >
          {{ todo.priority | priority }}
        </span>
      </div>
      @if (todo.description) {
        <p class="text-sm text-gray-600 mb-3">{{ todo.description }}</p>
      }
      <div class="flex justify-between items-center text-xs text-gray-500">
        <span>{{ date }}</span>
      </div>
    </div>
  `,
})
export class TodoCardComponent {
  @Input() todo!: Todo;

  get date() {
    if (this.todo.status === 'todo') {
      return `Créé le ${new Date(this.todo.createdAt).toLocaleDateString()}`;
    } else if (this.todo.status === 'in-progress') {
      return `Mis à jour le ${new Date(this.todo.updatedAt).toLocaleDateString()}`;
    } else {
      return `Terminé le ${new Date(this.todo.updatedAt).toLocaleDateString()}`;
    }
  }
}
