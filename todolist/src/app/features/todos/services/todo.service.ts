import { Injectable, signal } from '@angular/core';
import { Todo, CreateTodoRequest } from '../models/todo.model';
import { mockTodos } from 'src/app/infrastructure/mock-data/todo';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todos = signal<Todo[]>(mockTodos);

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

    const newTodo: Todo = {
      id: Date.now(),
      title: todoData.title,
      description: todoData.description || '',
      status: 'todo',
      priority: todoData.priority,
      assignedTo: todoData.assignedTo,
      createdBy: 1, // TODO: Récupérer l'ID de l'utilisateur connecté
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
      })
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

  // Méthodes utilitaires
  getTodosByStatus(status: Todo['status']): Todo[] {
    return this.todos().filter((todo) => todo.status === status);
  }

  getTodosByPriority(priority: Todo['priority']): Todo[] {
    return this.todos().filter((todo) => todo.priority === priority);
  }
}
