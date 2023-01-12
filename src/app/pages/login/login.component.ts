import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SesionService } from 'src/app/service/sesion.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private sessionService: SesionService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  // userTypeId: string = '';
  // userNumberId: string = '';
  // password: string = '';
  // userType: string = '';
  formGroup!: FormGroup;
  userTypes = [{ type: 'Administrador' }, { type: 'Contratista' }];
  idTypes = [
    { type: 'Tipo de documento' },
    { type: 'C.C' },
    { type: 'C.E' },
    { type: 'P.A' },
  ];

  ngOnInit(): void {
    this.buildForm();
  }
  buildForm() {
    this.formGroup = this.formBuilder.group({
      userTypeId: ['', [Validators.required]],
      userNumberId: ['', [Validators.required, Validators.minLength(7)]],
      password: ['', [Validators.required, Validators.minLength(7)]],
      userType: ['', [Validators.required]],
    });
  }
  login() {
    this.sessionService.login(
      this.formGroup.value.userTypeId.type,
      this.formGroup.value.userNumberId,
      this.formGroup.value.password,
      this.formGroup.value.userType.type
    );
    //TODO Verificar cómo NO utilizar el setTimeout y tal vez usar await
    //TODO Ocultar y/o restringir vistas a los usuarios que NO les corresponden
    setTimeout(() => {
      if (this.sessionService.session.userType == 'Contratista') {
        this.router.navigateByUrl(
          `jornada-laboral?type_id=${this.formGroup.value.userTypeId.type}&number_id=${this.formGroup.value.userNumberId}`
        );
      } else if (this.sessionService.session.userType == 'Administrador') {
        this.router.navigate(['contratistas']);
      } else {
        alert('acceso denegado');
      }
    }, 1000);
  }
}
