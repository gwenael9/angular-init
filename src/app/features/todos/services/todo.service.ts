import { computed, inject, Injectable, signal } from '@angular/core';
import { Todo, CreateTodoRequest } from '../models/todo.model';
import { mockTodos } from 'src/app/infrastructure/mock-data/todo';
import { AuthService } from '../../auth/services/auth';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todos = signal<Todo[]>(mockTodos);

  private authService = inject(AuthService);

  // Simuler un délai réseau
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // GET - Récupérer tous les todos
  async getAllTodos(): Promise<Todo[]> {
    await this.delay(300); // Simuler un appel API
    return this.todos();
  }

  // GET - Récupérer un todo par ID
  async getTodoById(id: number): Promise<Todo | undefined> {
    await this.delay(200);
    const todo = this.todos().find((t) => t.id === id);
    return todo;
  }

  // POST - Créer un nouveau todo
  async createTodo(todoData: CreateTodoRequest): Promise<Todo> {
    await this.delay(400);

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.id) throw new Error('Utilisateur non connecté');

    const newTodo: Todo = {
      id: Date.now(),
      title: todoData.title,
      description: todoData.description,
      status: 'todo',
      priority: todoData.priority,
      assignedTo: todoData.assignedTo,
      createdBy: currentUser?.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.todos.update((todos) => [...todos, newTodo]);
    return newTodo;
  }

  // PUT - Mettre à jour un todo
  async updateTodo(id: number, updates: Partial<Todo>): Promise<Todo | undefined> {
    await this.delay(300);

    let updatedTodo: Todo | undefined;
    this.todos.update((todos) =>
      todos.map((todo) => {
        if (todo.id === id) {
          updatedTodo = {
            ...todo,
            ...updates,
            updatedAt: new Date(),
          };
          return updatedTodo;
        }
        return todo;
      }),
    );

    return updatedTodo;
  }

  // DELETE - Supprimer un todo
  async deleteTodo(id: number): Promise<boolean> {
    await this.delay(250);

    let deleted = false;
    this.todos.update((todos) => {
      const initialLength = todos.length;
      const filtered = todos.filter((todo) => todo.id !== id);
      deleted = filtered.length < initialLength;
      return filtered;
    });

    return deleted;
  }

  // Signal computed - se recalcule automatiquement
  public completedTodos = computed(() => this.todos().filter((todo) => todo.status === 'done'));

  public pendingTodos = computed(() => this.todos().filter((todo) => todo.status === 'todo'));

  public inProgressTodos = computed(() =>
    this.todos().filter((todo) => todo.status === 'in-progress'),
  );

  public highPriorityTodos = computed(() =>
    this.todos().filter((todo) => todo.priority === 'high'),
  );

  public todoStats = computed(() => ({
    total: this.todos().length,
    completed: this.completedTodos().length,
    inProgress: this.inProgressTodos().length,
    pending: this.pendingTodos().length,
    highPriority: this.highPriorityTodos().length,
    completionRate:
      this.todos().length > 0 ? (this.completedTodos().length / this.todos().length) * 100 : 0,
  }));
}
