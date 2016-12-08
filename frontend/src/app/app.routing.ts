import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home';
import { EndComponent } from './end/end';
import { SmartphoneComponent } from './smartphone/smartphone';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'end', component: EndComponent },
  { path: 'home', component: HomeComponent },
  { path: 'smartphone', component: SmartphoneComponent },
];

export const routing = RouterModule.forRoot(routes);
