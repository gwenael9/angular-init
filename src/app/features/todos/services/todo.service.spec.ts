import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';
import { AuthService } from '../../auth/services/auth';

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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add todo correctly', async () => {
    const todo = await service.createTodo({
      title: 'Test Todo',
      description: 'Test Description',
      priority: 'medium',
    });
    expect(todo).toBeTruthy();
    expect(todo.title).toBe('Test Todo');
    expect(todo.createdBy).toBe(mockUser.id);
  });
});
