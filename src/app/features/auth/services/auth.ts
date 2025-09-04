import { Injectable, signal } from '@angular/core';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';
import { mockUsers } from 'src/app/infrastructure/mock-data';
import { Observable, of, throwError, delay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private defaultUsers: User[] = mockUsers;

  private currentUser = signal<User | null>(null);
  public currentUser$ = this.currentUser.asReadonly();

  // Mock data - mots de passe (en réalité, ils seraient hashés)
  private defaultPasswords: Record<string, string> = {
    'admin@example.com': 'admin123',
    'user@example.com': 'user123',
  };

  private users: User[] = [];
  private passwords: Record<string, string> = {};

  constructor() {
    this.loadUsersFromLocalStorage();

    // Vérifier s'il y a un utilisateur en session
    const token = localStorage.getItem('token');
    if (token) {
      // this.currentUser.set(JSON.parse(token));
      const user = this.decodeToken(token);
      this.currentUser.set(user);
    }
  }

  login(credentials: LoginRequest): Observable<User> {
    const user = this.users.find((u) => u.email === credentials.email);
    const password = this.passwords[credentials.email];

    if (user && password === credentials.password) {
      const token = this.generateMockJwt(user);
      localStorage.setItem('token', token);
      this.currentUser.set(user);
      // Simuler un délai réseau
      return of(user).pipe(delay(500));
    } else {
      return throwError(() => new Error('Email ou mot de passe incorrect'));
    }
  }

  register(userData: RegisterRequest): Observable<User> {
    // Vérifier si l'email existe déjà
    const existingUser = this.users.find((u) => u.email === userData.email);
    if (existingUser) {
      return throwError(() => new Error('Cet email est déjà utilisé'));
    }

    // Créer un nouvel utilisateur
    const newUser: User = {
      id: this.users.length + 1,
      name: userData.name,
      email: userData.email,
      role: 'user',
      password: '',
      createdAt: new Date(),
    };

    // Ajouter aux mock data
    this.users.push(newUser);
    this.passwords[userData.email] = userData.password;

    this.saveUserToLocalStorage();

    // Simuler un délai réseau
    return of(newUser).pipe(delay(500));
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('token');
    this.clearUserFromLocalStorage();
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  getAllUsers(): Observable<User[]> {
    return of(this.users).pipe(delay(300));
  }

  deleteUser(userId: number): Observable<void> {
    const index = this.users.findIndex((u) => u.id === userId);
    if (index !== -1) {
      this.users.splice(index, 1);
      this.saveUserToLocalStorage();
      return of(void 0).pipe(delay(300));
    }
    return throwError(() => new Error('Utilisateur non trouvé'));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Méthode pour simuler la génération d'un JWT (payload encodé en base64)
  private generateMockJwt(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({ id: user.id, email: user.email, name: user.name, role: user.role }),
    );
    const signature = btoa('mock-signature');
    return `${header}.${payload}.${signature}`;
  }

  // Méthode pour décoder le token JWT simulé
  private decodeToken(token: string): User | null {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        password: '',
        createdAt: new Date(),
      };
    } catch {
      return null;
    }
  }

  private saveUserToLocalStorage(): void {
    localStorage.setItem('allUsers', JSON.stringify(this.users));
    localStorage.setItem('usersPassword', JSON.stringify(this.passwords));
  }

  private loadUsersFromLocalStorage(): void {
    const allUsers = localStorage.getItem('allUsers');
    const usersPassword = localStorage.getItem('usersPassword');

    if (allUsers && usersPassword) {
      this.users = JSON.parse(allUsers);
      this.passwords = JSON.parse(usersPassword);
    } else {
      this.users = [...this.defaultUsers];
      this.passwords = { ...this.defaultPasswords };
    }
  }

  private clearUserFromLocalStorage(): void {
    localStorage.removeItem('allUsers');
    localStorage.removeItem('usersPassword');
    this.loadUsersFromLocalStorage();
  }
}
