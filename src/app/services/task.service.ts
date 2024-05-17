import { Injectable } from '@angular/core';
import { Task } from '../models/task';
import { LocalStorageService } from './local-storage.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // BehaviorSubject para manejar la lista de tareas
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  // Observable para que otros componentes puedan suscribirse a las tareas
  tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  // Constructor que inicializa el servicio y carga las tareas almacenadas en LocalStorage
  constructor(private localStorageService: LocalStorageService) {
    const storedTasks = this.localStorageService.getTasks();
    if (storedTasks) {
      this.tasksSubject.next(storedTasks);
    }
  }

  // Obtiene las tareas como un Observable
  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  // Agrega una nueva tarea y actualiza el BehaviorSubject y LocalStorage
  addTask(task: Task): void {
    const tasks = this.tasksSubject.getValue();
    tasks.push(task);
    this.tasksSubject.next(tasks);
    this.localStorageService.saveTasks(tasks);
  }

  // Actualiza una tarea existente por su id
  updateTask(updatedTask: Task): void {
    const tasks = this.tasksSubject.getValue();
    const index = tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = updatedTask;
      this.tasksSubject.next(tasks);
      this.localStorageService.saveTasks(tasks);
    }
  }

  // Obtiene una tarea por su id
  getTaskById(id: number): Task | undefined {
    const tasks = this.tasksSubject.getValue();
    return tasks.find(task => task.id === id);
  }

  // Elimina una tarea por su id y actualiza el BehaviorSubject y LocalStorage
  deleteTask(id: number): void {
    const tasks = this.tasksSubject.getValue();
    const updatedTasks = tasks.filter(task => task.id !== id);
    this.tasksSubject.next(updatedTasks);
    this.localStorageService.saveTasks(updatedTasks);
  }
}