import { keyframes } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: [ './progress.component.css' ]
})
export class ProgressComponent implements OnInit {

  public progreso1 = 25;
  public progreso2 = 45;

  constructor() { }

  ngOnInit(): void {
  }

  get getProgreso1() {
    return `${this.progreso1}%`
  }

  get getProgreso2() {
    return `${this.progreso2}%`
  }

  cambioValorHijo(valor: number) {
    console.log(valor);
  }

}
