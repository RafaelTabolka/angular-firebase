import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Todo } from '../../../models/Todo';
import { TodosService } from '../../services/todos.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {

  todoForm: FormGroup = new FormGroup({
    body: new FormControl('', [ Validators.required ]),
    done: new FormControl(false)
  })

  todos: Todo[] = []

  constructor(
    private snackbar: MatSnackBar,
    private authService:AuthService,
    private todosService: TodosService
  ) { }

  ngOnInit(): void {
    this.loadTodos()
  }

  loadTodos(): void {
    this.todosService.getTodos().subscribe((receivedTodos) => {
      this.todos = receivedTodos
    })
  }

  create(): void {
    const todo:Todo = this.todoForm.value
    this.todosService.createTodo(todo).subscribe(() =>{
      this.todoForm.reset()
      this.snackbar.open("Tarefa salva", "Ok", {
        verticalPosition:"top",
        horizontalPosition:"right",
        duration:5000
      })
      this.loadTodos()
    })
  }

  delete(todo: Todo): void {
    this.todosService.deleteTodo(todo).subscribe(() => {
      this.snackbar.open("Tarefa excluída", "Ok", {
        verticalPosition:'top',
        horizontalPosition:'right',
        duration:5000
      })
      this.loadTodos()
    })
  }

  toggleDone(todo: Todo): void {
     todo.done = !todo.done

     this.todosService.updateTodo(todo).subscribe() // subscribe precisa passar nada algumas vezes
  }

  signOut(): void {
    this.authService.signOut().subscribe()
  }
}