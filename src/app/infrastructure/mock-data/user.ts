import { User } from 'src/app/features/auth/models/user.model';

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123', // En production, ce serait hashé
    role: 'admin',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 2,
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    createdAt: new Date('2024-01-02'),
  },
];
