import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <div class="container">
        <base href="/">
        <router-outlet class="col-md-12 col-sm-12 col-xs-12"></router-outlet>
    </div>
    `
})
export class RiddleyDiddleyComponent  {
}