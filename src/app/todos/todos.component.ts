import { Component, OnInit } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { Todo } from '../models/todo';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.v2.html',
  styleUrls: ['./todos.component.v2.css'],
})
export class TodosComponent implements OnInit {
  // Luokan propertyt
  showDone = false; // Kontrolloi sitä näytetäänkö tehdyt tehtävät
  showTodos = true; // Kontrolloi sitä näytetäänkö tehtävät
  showEdit = false; // Kontrolloi sitä näytetäänkö muokkaus-lomake
  todos!: Todo[]; // Taulukko, johon tulee Todo-oliot
  done!: Todo[]; // Taulukko, johon tulee tehdyt Todo-oliot
  id = 0;
  otsikko = '';
  kuvaus = '';
  erapv = '';

  // DI TodoService
  constructor(
    private todoService: TodoService,
    private authService: AuthService,
    private router: Router
  ) {}

  // Komponentin latauksen yhteydessä suoritetaan getTodos()-metodi, joka hakee todot todoServicen metodilla
  ngOnInit() {
    this.getTodos();
    this.getDoneTodos();
  }

  // Metodit, joilla hallitaan näytettävää sisältöä
  doneVisibility() {
    this.showDone = true;
    this.showTodos = false;
  }

  todosVisibility() {
    this.showDone = false;
    this.showTodos = true;
  }

  editVisibility() {
    this.showEdit = !this.showEdit;
  }

  // Metodi, jolla haetaan tämä päivä ja muutetaan samaan muotoon, kuin todo-oliossa oleva erapv
  getDateToday() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // Haetaan Todot, sortataan ne, filtteröidään tänään erääntyvät ja mikäli niitä on, niin kutsutaan notify-metodia
  getTodos() {
    this.todoService.getTodos().subscribe((todos) => {
      this.todos = todos;
      console.log(this.todos);
      this.todos = this.todos.sort(function (a, b) {
        a.erapv = a.erapv.split('/').reverse().join('');
        b.erapv = b.erapv.split('/').reverse().join('');
        return a.erapv.localeCompare(b.erapv);
      });
      const today = this.getDateToday();
      const eraantyvat = this.todos.filter((todo) => todo.erapv === today);
      if (eraantyvat.length > 0 && today === eraantyvat[0].erapv) {
        this.notify(eraantyvat);
      }
    });
  }

  // Haetaan tehdyt todot ja sortataan ne
  getDoneTodos() {
    this.todoService.getDoneTodos().subscribe((todos) => {
      this.done = todos;
      this.done = this.done.sort(function (a, b) {
        a.erapv = a.erapv.split('/').reverse().join('');
        b.erapv = b.erapv.split('/').reverse().join('');
        return a.erapv.localeCompare(b.erapv);
      });
    });
  }

  // Metodi, jolla poistetaan valittu todo
  poista(t: Todo) {
    // this.todos = this.todos.filter((todo) => todo !== t);
    this.todoService.deleteTodo(t);
    this.getTodos();
  }

  // Metodi, jolla tuodaan muokkauslomake esiin ja viedään kenttiin valitun todo:n tiedot
  muokkaa(todo: Todo) {
    this.editVisibility();
    this.otsikko = todo.otsikko;
    this.kuvaus = todo.kuvaus;
    this.erapv = todo.erapv;
    this.id = todo.id;
  }

  // Tallentaa muokatun todo:n
  tallennaMuokattu() {
    this.todoService.updateTodo({
      otsikko: this.otsikko,
      kuvaus: this.kuvaus,
      erapv: this.erapv,
      id: this.id,
    });
    this.otsikko = '';
    this.kuvaus = '';
    this.erapv = '';
    this.id = 0;
    this.editVisibility();
  }

  // Laittaa valitun todo:n valmiiksi (poistaa todo:n ja lisää sen tehtyihin)
  valmis(t: Todo) {
    this.todoService.deleteTodo(t);
    this.todoService.addDoneTodo(t);
    this.getTodos();
    this.getDoneTodos();
  }

  // Kirjaa käyttäjän ulos authservicen signout metodilla
  logout() {
    this.authService
      .signOut()
      .then(() => {
        this.authService.user = null;
        this.router.navigate(['login']);
        console.log(sessionStorage.getItem('loggedin'));
      })
      .catch((e: Error) => console.log(e.message));
  }

  // Notify-metodi hyödyntää selaimen Notifikaatio-ominaisuutta.
  // Saa argumenttina eraantyvat-taulukon, jossa on Todo-olioita
  // Käydään erääntyvät taulukko läpi ja muodostetaan otsikoista stringi
  // Jos selaimessa on notifikaatio-ominaisuus ja käyttäjä on antanut luvan, niin näytetään notifikaatio, jossa erääntyvien otsikot
  notify(eraantyvat: Todo[]) {
    let str = '';
    eraantyvat.forEach((todo) => {
      if (str === '') {
        str = str + todo.otsikko;
      } else {
        str = str + ', ' + todo.otsikko;
      }
    });
    if (!('Notification' in window)) {
      alert('Selain ei tue ilmoituksia');
    } else if (Notification.permission === 'granted') {
      const notification = new Notification('Muista tehdä tänään: ' + str);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          const notification = new Notification('Muista tehdä tänään: ' + str);
        }
      });
    }
  }
}
