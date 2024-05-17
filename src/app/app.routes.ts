// Importación del módulo de rutas desde Angular Router
import { Routes } from '@angular/router';
// Importación de los componentes de las páginas de tareas
import { TaskListComponent } from './pages/task-list/task-list.component';
import { TaskCreateComponent } from './pages/task-create/task-create.component';
import { TaskEditComponent } from './pages/task-edit/task-edit.component';
import { TaskDetailComponent } from './pages/task-detail/task-detail.component';

// Definición de las rutas de la aplicación
export const routes: Routes = [
  { path: 'tasks', component: TaskListComponent },
  { path: 'tasks/new', component: TaskCreateComponent },
  { path: 'tasks/:id/edit', component: TaskEditComponent } ,
  { path: 'tasks/detail/:id', component: TaskDetailComponent } ,
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
];
