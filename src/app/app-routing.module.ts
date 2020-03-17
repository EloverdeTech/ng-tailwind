import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';


const routes: Routes = [
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
