export class Task {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  priority: string;
  tags: string[];
  completed: boolean;

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
