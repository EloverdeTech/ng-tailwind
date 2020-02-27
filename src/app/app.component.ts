import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NgtDatatableComponent, NgtDatatableType, NgtModalComponent } from 'projects/ng-tailwind/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('ngtModal', { static: true }) ngtModal: NgtModalComponent;
  @ViewChild('ngtTable', { static: true }) ngtTable: NgtDatatableComponent;

  title = 'lib-test';

  public ngtTableType = NgtDatatableType.remote;

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

  ngAfterViewInit() {
    this.ngtTable.init();
  }

  openModal() {
    this.ngtModal.open();
  }

  closeModal() {
    this.ngtModal.close();
  }

  clickAction() {
    console.log('Click Action');    
  }
}