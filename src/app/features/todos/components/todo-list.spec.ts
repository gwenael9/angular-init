import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from '../services/todo.service';

describe('TodoListComponent', () => {
  let fixture: ComponentFixture<TodoListComponent>;
  let todoService: jasmine.SpyObj<TodoService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TodoService', [
      'getAllTodos',
      'pendingTodos',
      'inProgressTodos',
      'completedTodos',
      'todoStats',
    ]);
    spy.pendingTodos.and.returnValue([]);
    spy.inProgressTodos.and.returnValue([]);
    spy.completedTodos.and.returnValue([]);
    spy.todoStats.and.returnValue({ total: 0, completed: 0, pending: 0 });

    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [{ provide: TodoService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    todoService = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
  });

  it('should load todos and stats on init', fakeAsync(() => {
    fixture.detectChanges();
    expect(todoService.pendingTodos).toHaveBeenCalled();
    expect(todoService.inProgressTodos).toHaveBeenCalled();
    expect(todoService.completedTodos).toHaveBeenCalled();
    expect(todoService.todoStats).toHaveBeenCalled();
  }));
});
