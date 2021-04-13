import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';
import { LoginForm } from '../interfaces/login-form-interface';
import { RegisterForm } from '../interfaces/register-form.interface';

import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public auth2: any;
  public usuario: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.id || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    }
  }

  googleInit() {
    return new Promise<void>( resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id:
            '4811383426-fdaupav1go589v8t1ljdgp14aghdkom9.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  validarToken(): Observable<boolean> {
    return this.http
      .get(`${base_url}/login/renew`, {
        headers: {
          'x-token': this.token,
        },
      })
      .pipe(
        map((resp: any) => {
          console.log(resp);

          const { email, google, nombre, role, id, img = '' } = resp.usuario

          this.usuario = new Usuario(nombre, email, '', img, google, role, id)

          localStorage.setItem('token', resp.token);
          return true;
        }),
        catchError((error) => of(false))
      );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  actualizarPerfil(data: { email: string, nombre: string, role: string }) {

    data = {
      ...data,
      role : this.usuario.role
    }
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers);

  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token }).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  cargarUsuarios(desde: number = 0) {
    return this.http.get<CargarUsuario>(`${base_url}/usuarios?desde=${desde}`, this.headers)
    .pipe(
      map( resp => {
        const usuarios = resp.users.map(
          user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.id))
        return {
          total: resp.total,
          users: usuarios
        };
      })
    );
  }

  eliminarUsuario(usuario: Usuario) {
    return this.http.delete(`${base_url}/usuarios/${usuario.id}`, this.headers);
  }

  guardarUsuario(data: Usuario) {

    return this.http.put(`${base_url}/usuarios/${data.id}`, data, this.headers);

  }
}
