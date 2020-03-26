import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';


const routes: Routes = [
  {
    "path": "",
    "redirectTo": "docs",
    "pathMatch": "full"
  },
  {
    "path": "docs",
    "component": HomeComponent,
    "children": [
      {
        "path": "",
        "redirectTo": "installation",
        "pathMatch": "full"
      },
      {
        "path": "installation",
        "loadChildren": () => import('src/app/pages/getting-started/installation/installation.module').then(m => m.InstallationModule)
      },
      {
        "path": "release-notes",
        "loadChildren": () => import('src/app/pages/getting-started/release-notes/release-notes.module').then(m => m.ReleaseNotesModule)
      },
      {
        "path": "ngt-action",
        "loadChildren": () => import('src/app/pages/action-components/ngt-action-page/ngt-action-page.module').then(m => m.NgtActionPageModule)
      },
      {
        "path": "ngt-button",
        "loadChildren": () => import('src/app/pages/action-components/ngt-button-page/ngt-button-page.module').then(m => m.NgtButtonPageModule)
      },
      {
        "path": "ngt-floating-button",
        "loadChildren": () => import('src/app/pages/action-components/ngt-floating-button-page/ngt-floating-button-page.module').then(m => m.NgtFloatingButtonPageModule)
      },
      {
        "path": "ngt-checkbox",
        "loadChildren": () => import('src/app/pages/form-components/ngt-checkbox-page/ngt-checkbox-page.module').then(m => m.NgtCheckboxPageModule)
      },
      {
        "path": "ngt-date",
        "loadChildren": () => import('src/app/pages/form-components/ngt-date-page/ngt-date-page.module').then(m => m.NgtDatePageModule)
      },
      {
        "path": "ngt-dropzone",
        "loadChildren": () => import('src/app/pages/form-components/ngt-dropzone-page/ngt-dropzone-page.module').then(m => m.NgtDropzonePageModule)
      },
      {
        "path": "ngt-datatable",
        "loadChildren": () => import('src/app/pages/table-components/ngt-datatable-page/ngt-datatable-page.module').then(m => m.NgtDatatablePageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
