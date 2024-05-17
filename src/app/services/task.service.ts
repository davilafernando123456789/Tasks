import { Injectable } from '@angular/core';
import { Task } from '../models/task';
import { LocalStorageService } from './local-storage.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  constructor(private localStorageService: LocalStorageService) {
    const storedTasks = this.localStorageService.getTasks();
    if (storedTasks) {
      this.tasksSubject.next(storedTasks);
    }
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  addTask(task: Task): void {
    const tasks = this.tasksSubject.getValue();
    tasks.push(task);
    this.tasksSubject.next(tasks);
    this.localStorageService.saveTasks(tasks);
  }

  updateTask(updatedTask: Task): void {
    const tasks = this.tasksSubject.getValue();
    const index = tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = updatedTask;
      this.tasksSubject.next(tasks);
      this.localStorageService.saveTasks(tasks);
    }
  }

  getTaskById(id: number): Task | undefined {
    const tasks = this.tasksSubject.getValue();
    return tasks.find(task => task.id === id);
  }

  deleteTask(id: number): void {
    const tasks = this.tasksSubject.getValue();
    const updatedTasks = tasks.filter(task => task.id !== id);
    this.tasksSubject.next(updatedTasks);
    this.localStorageService.saveTasks(updatedTasks);
  }
}
