import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {MainPageComponent} from './components/main-page/main-page.component';
import {TokenGuard} from './service/guards/token-guard';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'tasks', component: MainPageComponent, canActivate: [TokenGuard]},
  {path: '', component: LoginComponent},
  {path: '**', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
