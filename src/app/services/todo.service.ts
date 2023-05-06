import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  deleteDoc,
  setDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  /*   todos = [
    {
      id: 1,
      otsikko: 'Tee ruokaa',
      kuvaus: 'Tee ruokaa koko perheelle, esimerkiksi kanakeittoa',
      erapv: '1.4.2023',
    },
    {
      id: 2,
      otsikko: 'Pese auto',
      kuvaus: 'Tourulan Nesteen itsepalveluhallissa',
      erapv: '1.4.2023',
    },
    {
      id: 3,
      otsikko: 'Ulkoiluta koira',
      kuvaus: 'Pieni lenkki',
      erapv: '2.3.2023',
    },
    {
      id: 4,
      otsikko: 'Tee koulutehtävä',
      kuvaus: 'Frontend-perusteet -opintojakson tehtävä 98',
      erapv: '4.4.2023',
    },
  ];

  done = [
    {
      id: 0,
      otsikko: 'Tehty tehtävä',
      kuvaus: 'Hyvin meni',
      erapv: '1.1.1999',
    },
  ]; */

  constructor(private firestore: Firestore) {}

  /* getTodos() {
    return this.todos;
  }

  getDoneTodos() {
    return this.done;
  }

  saveTodo(newTodo: {
    id: number;
    otsikko: string;
    kuvaus: string;
    erapv: string;
  }) {
    const highestId = this.todos[this.todos.length - 1].id;
    newTodo.id = highestId + 1;
    this.todos.push(newTodo);
    console.log(newTodo);
  }

  deleteTodo(id: number) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }

  todoDone(id: number) {
    const todo = this.todos.filter((todo) => todo.id === id);
    this.done.push(...todo);
  }

  editTodo(editedTodo: Todo) {
    const indexToEdit = this.todos.findIndex(
      (todo) => todo.id === editedTodo.id
    );
    this.todos[indexToEdit] = {
      id: editedTodo.id,
      otsikko: editedTodo.otsikko,
      kuvaus: editedTodo.kuvaus,
      erapv: editedTodo.erapv,
    };
  } */

  // Angularfire-metodit
  // CREATE
  addTodo(todo: Todo) {
    const todosRef = collection(this.firestore, 'todos');
    return addDoc(todosRef, todo);
  }

  addDoneTodo(todo: Todo) {
    const doneTodosRef = collection(this.firestore, 'doneTodos');
    return addDoc(doneTodosRef, todo);
  }

  // READ Todos
  getTodos(): Observable<Todo[]> {
    const todosRef = collection(this.firestore, 'todos');
    return collectionData(todosRef, { idField: 'id' }) as Observable<Todo[]>;
  }

  // READ Done Todos
  getDoneTodos(): Observable<Todo[]> {
    const doneTodosRef = collection(this.firestore, 'doneTodos');
    return collectionData(doneTodosRef, { idField: 'id' }) as Observable<
      Todo[]
    >;
  }

  // UPDATE
  updateTodo(todo: Todo) {
    const todoDocRef = doc(this.firestore, `todos/${todo.id}`);
    return setDoc(todoDocRef, todo);
  }

  // DELETE
  deleteTodo(todo: Todo) {
    const todoDocRef = doc(this.firestore, `todos/${todo.id}`);
    return deleteDoc(todoDocRef);
  }
}
