import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ReactiveFormsModule, AbstractControl } from '@angular/forms'; // Importar FormArray y FormControl
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css']
})
export class TaskCreateComponent implements OnInit {
  taskForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  // Método para volver atrás
  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  // Método para inicializar el formulario
  initForm(): void {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      priority: ['', Validators.required],
      tags: this.formBuilder.array([])
    });
  }

  // Método para obtener el FormArray de las etiquetas
  get tags(): FormArray {
    return this.taskForm.get('tags') as FormArray;
  }

  // Método para añadir una nueva etiqueta al FormArray
  addTag(tag: string): void {
    this.tags.push(this.formBuilder.control(tag.trim()));
  }

  // Método para eliminar una etiqueta del FormArray
  removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  // Método para enviar el formulario
  onSubmit(): void {
    if (this.taskForm.valid) {
      const { title, description, dueDate, priority, tags } = this.taskForm.value;
      const newTask: Task = {
        id: Date.now(),
        title,
        description,
        dueDate,
        priority,
        tags: tags.map((tag: string) => tag.trim()), 
        completed: false
      };
      this.taskService.addTask(newTask);
      this.router.navigate(['/tasks']);
    }
  }

  // Método para convertir un AbstractControl a FormControl
  asFormControl(ctrl: AbstractControl): FormControl {
    return ctrl as FormControl;
  }
}