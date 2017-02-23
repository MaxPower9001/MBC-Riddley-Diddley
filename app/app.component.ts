import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <div class="container">
        <base href="/">
        <header></header>
        <router-outlet></router-outlet>
    </div>
    `
})
export class AppComponent  {
}