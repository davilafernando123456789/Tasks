import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks: Observable<Task[]> = of([]); // Inicializa 'tasks' con un Observable vacío
  filteredTasks: Observable<Task[]> = of([]);
  filterCriteria: string = '';
  showNotification: boolean = false;

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private filteredTasksSubject = new BehaviorSubject<Task[]>([]);

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.tasks = this.taskService.getTasks();
    this.tasks.subscribe((tasks) => {
      // Convertimos 'dueDate' a una instancia de Date
      tasks.forEach((task) => {
        task.dueDate = new Date(task.dueDate);
      });
      this.tasksSubject.next(tasks);
      this.filteredTasksSubject.next(tasks);
    });
    this.filteredTasks = this.filteredTasksSubject.asObservable();
  }

  getPriorityClass(priority: string) {
    switch (priority) {
      case 'low':
        return 'badge badge-info'; // Azul claro
      case 'medium':
        return 'badge badge-warning'; // Amarillo
      case 'high':
        return 'badge badge-danger'; // Rojo
      default:
        return 'badge badge-secondary'; // Gris
    }
  }

  getStatusClass(completed: boolean) {
    return completed ? 'badge badge-success' : 'badge badge-danger'; // Verde o rojo
  }

  filterTasks(): void {
    const filterCriteria = this.filterCriteria.toLowerCase();
    const tasks = this.tasksSubject.getValue();

    if (filterCriteria === 'status') {
      const statusFilter = (
        document.getElementById('status-filter') as HTMLSelectElement
      ).value;
      const filteredTasks = tasks.filter(
        (task) => task.completed === (statusFilter === 'completed')
      );
      this.filteredTasksSubject.next(filteredTasks);
    } else if (filterCriteria === 'duedate') {
      const dateFilter = (document.getElementById('date-filter') as HTMLInputElement).value;
      const filteredTasks = tasks.filter((task) => {
        const filterDate = new Date(dateFilter).getTime();
        const taskDate = task.dueDate ? task.dueDate.getTime() : 0;
        return taskDate === filterDate;
      });
      this.filteredTasksSubject.next(filteredTasks);
    } else if (filterCriteria === 'priority') {
      const priorityFilter = (
        document.getElementById('priority-filter') as HTMLSelectElement
      ).value;
      const filteredTasks = tasks.filter(
        (task) => task.priority.toLowerCase() === priorityFilter.toLowerCase()
      );
      this.filteredTasksSubject.next(filteredTasks);
    } else {
      this.filteredTasksSubject.next(tasks);
    }
  }

  sortTasks(sortCriteria: 'dueDate' | 'priority'): void {
    const tasks = this.filteredTasksSubject.getValue();
    const sortedTasks = tasks.sort((a, b) => {
      if (a[sortCriteria] < b[sortCriteria]) return -1;
      if (a[sortCriteria] > b[sortCriteria]) return 1;
      return 0;
    });
    this.filteredTasksSubject.next(sortedTasks);
  }

  getTasks(): void {
    this.tasks = this.taskService.getTasks();
    this.tasks.subscribe((tasks) => {
      tasks.forEach((task) => {
        task.dueDate = new Date(task.dueDate);
      });
      this.filteredTasksSubject.next(tasks);
    });
  }

  viewTask(task: Task): void {
    this.router.navigate(['/tasks/detail', task.id]);
  }

  createTask(): void {
    this.router.navigate(['/tasks/new']);
  }

  listTask(): void {
    this.router.navigate(['/tasks']);
  }

  editTask(task: Task): void {
    this.router.navigate(['/tasks', task.id, 'edit']);
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task.id);
    this.getTasks();
    this.showNotification = true;
  }

  // Agrega un método para cerrar la notificación después de un tiempo determinado
  closeNotification(): void {
    this.showNotification = false;
  }

  handleFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    const parentElement = target.parentElement;

    if (parentElement) {
      // Oculta todos los inputs
      ['input', '#date-filter', '#text-filter', '#status-filter'].forEach(
        (selector) => {
          const element = parentElement.querySelector(selector) as HTMLElement;
          if (element) {
            element.style.display = 'none';
          }
        }
      );

      // Muestra el input correspondiente al criterio de filtro seleccionado
      let filterSelector = '';
      if (value === 'status') {
        filterSelector = '#status-filter';
      } else if (value === 'duedate') {
        filterSelector = '#date-filter';
      } else if (value === 'priority') {
        filterSelector = '#text-filter';
      } else {
        filterSelector = 'input';
      }

      const filterElement = parentElement.querySelector(
        filterSelector
      ) as HTMLElement;
      if (filterElement) {
        filterElement.style.display = 'block';
      }
    }
  }

  handleSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target.value === 'dueDate' || target.value === 'priority') {
      this.sortTasks(target.value as 'dueDate' | 'priority');
    } else {
      console.error('Invalid sort criteria:', target.value);
    }
  }
}
