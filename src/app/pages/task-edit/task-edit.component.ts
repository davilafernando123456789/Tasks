import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css'],
})
export class TaskEditComponent implements OnInit {
  taskForm!: FormGroup;
  task!: Task;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.loadTask();
  }

  // Cargar tarea basada en el ID de los parámetros de ruta
  private loadTask(): void {
    const taskId = Number(this.route.snapshot.paramMap.get('id'));
    const task = this.taskService.getTaskById(taskId);
    if (!task) {
      console.error(`Task with id ${taskId} not found`);
      this.router.navigate(['/tasks']);
    } else {
      this.task = task;
      this.initializeForm();
    }
  }

  // Formato de fecha a cadena en formato 'AAAA-MM-DD
  private formatDate(date: Date): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  // Inicializar el formulario con los datos de la tarea
  private initializeForm(): void {
    this.taskForm = this.formBuilder.group({
      title: [this.task.title, Validators.required],
      description: [this.task.description],
      dueDate: [this.formatDate(this.task.dueDate), Validators.required],
      priority: [this.task.priority, Validators.required],
      completed: [this.task.completed, Validators.required],
      tags: this.formBuilder.array(
        this.task.tags.map((tag) => this.formBuilder.control(tag.trim()))
      ),
    });
  }

  // Obtención de etiquetas FormArray
  get tags(): FormArray {
    return this.taskForm.get('tags') as FormArray;
  }

  // Añadir un nuevo control de etiqueta al FormArray
  addTag(tag: string): void {
    this.tags.push(this.formBuilder.control(tag));
  }

  // Eliminar el control de etiqueta en el índice especificado de FormArray
  removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  // Volver a la vista de tareas
  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  // Enviar datos del formulario
  onSubmit(): void {
    if (this.taskForm.valid) {
      const { title, description, dueDate, priority, completed, tags } =
        this.taskForm.value;
      const editedTask: Task = {
        ...this.task,
        title,
        description,
        dueDate: new Date(dueDate),
        priority,
        completed: completed === 'true',
        tags: tags.map((tag: string) => tag.trim()),
      };

      this.taskService.updateTask(editedTask);
      this.router.navigate(['/tasks']);
    }
  }

  // Función auxiliar para convertir AbstractControl en FormControl
  asFormControl(ctrl: AbstractControl): FormControl {
    return ctrl as FormControl;
  }
}
