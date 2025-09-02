import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../services/todo.service';
import { StatistiquesComponent } from './statistique.component';
import { TodoCardComponent } from './todo-card.component';
import { TodoFormComponent } from './todo-form.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, StatistiquesComponent, TodoCardComponent, TodoFormComponent],
  template: `
    <app-todo-form></app-todo-form>
    <app-statistiques></app-statistiques>
    <!-- Colonnes Kanban -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- À faire -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          À faire
          <span class="text-sm text-gray-500">({{ todoService.pendingTodos().length }})</span>
        </h3>
        <div class="space-x-3">
          @for (todo of todoService.pendingTodos(); track todo.id) {
            <app-todo-card [todo]="todo"></app-todo-card>
          }
        </div>
      </div>

      <!-- En cours -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          En cours
          <span class="text-sm text-gray-500">({{ todoService.inProgressTodos().length }})</span>
        </h3>
        <div class="space-y-3">
          @for (todo of todoService.inProgressTodos(); track todo.id) {
            <app-todo-card [todo]="todo"></app-todo-card>
          }
        </div>
      </div>

      <!-- Terminé -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Terminé
          <span class="text-sm text-gray-500">({{ todoService.completedTodos().length }})</span>
        </h3>
        <div class="space-y-3">
          @for (todo of todoService.completedTodos(); track todo.id) {
            <app-todo-card [todo]="todo"></app-todo-card>
          }
        </div>
      </div>
    </div>
  `,
})
export class TodoListComponent {
  todoService = inject(TodoService);
}
