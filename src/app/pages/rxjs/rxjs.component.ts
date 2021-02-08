import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';


@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnInit, OnDestroy {

  public intervalSubs: Subscription;


  constructor() {

    this.intervalSubs = this.retornIntervalo()
    .subscribe(
      (valor)=>console.log(valor)
    );

    // this.retornaObservable().pipe(
    //   retry()
    // ).subscribe(
    //   valor => console.log('Sub: ', valor ),
    //   error => console.warn('Error: ', error),
    //   () =>console.info('obs complete')
    // );
  }

  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  ngOnInit(): void {
  }

  retornIntervalo(): Observable<number> {
    return interval(100)
          .pipe(
             // take(10),
            map( valor => valor + 1),
            filter(valor=> (valor%2 === 0)? true: false)
          );
  }

  retornaObservable(): Observable<number> {
    let i = -1;

    return new Observable<number>(observer =>{
        const intervalo = setInterval( () => {
          i ++;
          observer.next(i);

          if (i === 4) {
            clearInterval(intervalo);
            observer.complete();
          }
          if (i === 2) {
            console.log('i igual a 2');
            observer.error('i igual a 2');
          }

        }, 1000);
    });
  }

}
