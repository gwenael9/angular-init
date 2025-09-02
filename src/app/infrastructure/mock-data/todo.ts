import { Todo } from 'src/app/features/todos/models/todo.model';

export const mockTodos: Todo[] = [
  {
    id: 1,
    title: 'Apprendre Angular',
    description: "Étudier les fondamentaux d'Angular 20+",
    status: 'todo',
    priority: 'high',
    createdBy: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    title: 'Créer un projet',
    description: 'Développer une application TodoList',
    status: 'in-progress',
    priority: 'medium',
    createdBy: 1,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: 3,
    title: "Configurer l'environnement",
    description: 'Installer Node.js, Angular CLI et configurer VS Code',
    status: 'done',
    priority: 'high',
    createdBy: 1,
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-14'),
  },
];
