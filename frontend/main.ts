// 
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// Need the method to enable, disable the production mode
import {enableProdMode} from '@angular/core';
// Import the application modules
import { RiddleyDiddleyModule } from './riddley-diddley.module';


const platform = platformBrowserDynamic();
// We shoud enable the production mode
enableProdMode();
// Start the Web application
platform.bootstrapModule(RiddleyDiddleyModule);
