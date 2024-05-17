export class Task {
  // Atributos de la clase Task
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  priority: string;
  tags: string[];
  completed: boolean;

  // Constructor para inicializar una nueva tarea
  constructor(
    id: number,
    title: string,
    description: string,
    dueDate: Date,
    priority: string,
    tags: string[],
    completed: boolean
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.tags = tags;
    this.completed = completed;
  }
}
