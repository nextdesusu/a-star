import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NodeComponent } from './node/node.component';
import { NodeContainerComponent } from './node-container/node-container.component';

@NgModule({
  declarations: [
    AppComponent,
    NodeComponent,
    NodeContainerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
