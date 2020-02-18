import { Component, ViewChild } from '@angular/core';
import { NgtModalComponent } from 'projects/ng-tailwind/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('ngtModal', { static: true }) ngtModal: NgtModalComponent;

  title = 'lib-test';

  public floatingButtonMenus = [
    {
      name: '',
      action: '/menus/incluir',
      icon: 'fa fa-bars',
      tooltip: 'Novo Menu'
    },
    {
      name: '',
      action: '/gerenciar-usuarios/incluir',
      icon: 'fas fa-users',
      tooltip: 'Novo Usuário'
    },
    {
      name: '',
      action: '/empresas/incluir',
      icon: 'fas fa-briefcase',
      tooltip: 'Nova Empresa'
    }
  ];

  openModal() {
    this.ngtModal.open();
  }

  closeModal() {
    this.ngtModal.close();
  }
}