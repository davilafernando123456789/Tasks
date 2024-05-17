import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css'
})
export class TaskDetailComponent implements OnInit {
  task!: Task;

  constructor(
    // Inyección de servicios y utilidades necesarias
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    // Obtener el ID de la tarea de los parámetros de la ruta
    const taskId = Number(this.route.snapshot.paramMap.get('id'));
    const task = this.taskService.getTaskById(taskId);
    if (!task) {
      console.error(`Task with id ${taskId} not found`);
      this.router.navigate(['/tasks']);
    } else {
      this.task = task;
    }
  }

  // Método para obtener la clase de prioridad de la tarea
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

  // Método para obtener la clase de estado de la tarea
  getStatusClass(completed: boolean) {
    return completed ? 'badge badge-success' : 'badge badge-danger'; // Verde o rojo
  }

  // Método para editar la tarea
  editTask(): void {
    this.router.navigate(['/tasks', this.task.id, 'edit']);
  }

  // Método para volver atrás
  goBack(): void {
    this.router.navigate(['/tasks']);
  }
}