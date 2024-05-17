import { Injectable } from '@angular/core';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  // Clave para almacenar y recuperar las tareas desde LocalStorage
  private storageKey = 'tasks';

  // Obtiene las tareas almacenadas en LocalStorage
  getTasks(): Task[] {
    const storedTasks = localStorage.getItem(this.storageKey);
    return storedTasks ? JSON.parse(storedTasks) : [];
  }

  // Guarda la lista de tareas en LocalStorage
  saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }
}