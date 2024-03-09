import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {MainPageComponent} from './components/main-page/main-page.component';
import {UserPanelComponent} from './components/user/user-panel/user-panel.component';
import {UserProfileComponent} from './components/user/user-profile/user-profile.component';
import {TaskInputComponent} from './components/user/task-input/task-input.component';
import {UserActionsComponent} from './components/user/user-actions/user-actions.component';
import {TaskItemComponent} from './components/tasks/task-item/task-item.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TaskListComponent} from './components/tasks/task-list/task-list.component'
import {API_SERVER} from './utilities/api-server';
import {environment} from './enviroment/enviroment';
import {NotificationComponent} from './components/shared/notification/notification.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainPageComponent,
    UserPanelComponent,
    UserProfileComponent,
    TaskInputComponent,
    UserActionsComponent,
    TaskItemComponent,
    TaskListComponent,
    NotificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: API_SERVER,
      useValue: environment.apiServer,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
