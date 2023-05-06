import { Component } from '@angular/core';
import { Todo } from '../models/todo';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddComponent {
  showForm = false;
  otsikko = '';
  kuvaus = '';
  erapv = '';

  // DI TodoService
  constructor(private todoService: TodoService) {}

  openCloseForm() {
    this.showForm = !this.showForm;
  }

  tallenna() {
    this.todoService.addTodo({
      otsikko: this.otsikko,
      kuvaus: this.kuvaus,
      erapv: this.erapv,
    } as Todo);
    this.openCloseForm();
    this.otsikko = '';
    this.kuvaus = '';
    this.erapv = '';
  }
}
