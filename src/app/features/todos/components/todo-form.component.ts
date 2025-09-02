import { Component, inject, signal } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { FormsModule } from '@angular/forms';
import { ErrorService } from '../../../shared/services/error.service';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 class="text-xl font-semibold mb-4">Ajouter une tâche</h3>
      <form (ngSubmit)="addTodo()" #todoForm="ngForm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            [(ngModel)]="newTodo.title"
            name="title"
            placeholder="Titre de la tâche"
            class="border p-2 rounded"
            required
          />

          <input
            type="text"
            [(ngModel)]="newTodo.description"
            name="description"
            placeholder="Description (optionnel)"
            class="border p-2 rounded"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select [(ngModel)]="newTodo.priority" name="priority" class="border p-2 rounded">
            <option value="low">Basse priorité</option>
            <option value="medium">Priorité moyenne</option>
            <option value="high">Haute priorité</option>
          </select>

          <button
            type="submit"
            [disabled]="!todoForm.form.valid || addingTodo()"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            @if (addingTodo()) {
              <span
                class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
              ></span>
              Ajout en cours...
            } @else {
              Ajouter
            }
          </button>
        </div>
      </form>
    </div>
  `,
})
export class TodoFormComponent {
  addingTodo = signal(false);
  newTodo = {
    title: '',
    description: '',
    priority: 'medium' as const,
  };

  private todoService = inject(TodoService);
  private errorService = inject(ErrorService);

  async addTodo() {
    if (this.newTodo.title.trim()) {
      try {
        this.addingTodo.set(true);
        await this.todoService.createTodo({
          title: this.newTodo.title,
          description: this.newTodo.description,
          priority: this.newTodo.priority,
        });

        // Réinitialiser le formulaire
        this.newTodo.title = '';
        this.newTodo.description = '';
      } catch (error) {
        const message = "Erreur lors de l'ajout du todo";
        console.error(message, error);
        this.errorService.showError(message);
      } finally {
        this.addingTodo.set(false);
      }
    }
  }
}
