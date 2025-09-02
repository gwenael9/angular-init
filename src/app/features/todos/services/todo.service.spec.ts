import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';
import { AuthService } from '../../auth/services/auth';
import { CreateTodoRequest } from '../models/todo.model';

describe('TodoService', () => {
  let service: TodoService;

  const mockUser = {
    id: 1,
    name: 'Mock User',
    email: 'mock@example.com',
    role: 'user',
    password: '',
    createdAt: new Date(),
  };

  class MockAuthService {
    getCurrentUser() {
      return mockUser;
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodoService, { provide: AuthService, useClass: MockAuthService }],
    });
    service = TestBed.inject(TodoService);
    service['todos'].set([]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add todo correctly', async () => {
    const newTodo: CreateTodoRequest = {
      title: 'Test Todo',
      description: 'Test Description',
      priority: 'medium',
    };
    const todo = await service.createTodo(newTodo);
    expect(todo).toBeTruthy();
    expect(todo.title).toBe('Test Todo');
    expect(todo.createdBy).toBe(mockUser.id);
  });

  it('should compute high priority todos correctly', async () => {
    const todo: CreateTodoRequest = {
      title: 'Todo 1',
      priority: 'high',
      description: 'Description for Todo 1',
    };

    await service.createTodo(todo);
    expect(service.highPriorityTodos().length).toBe(1);
  });
});
