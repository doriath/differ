import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxDiffModule } from 'ngx-diff';

import { App } from './app';
import { Diff } from './diff/diff';

@NgModule({
  declarations: [
    App,
    Diff
  ],
  imports: [
    BrowserModule,
    NgxDiffModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
