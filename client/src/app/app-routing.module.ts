import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './routes/login/login.component';
import { MovieShowtimesComponent } from './routes/movie/movie-showtimes/movie-showtimes.component';
import { MovieComponent } from './routes/movie/movie.component';
import { NavbarComponent } from './routes/navbar/navbar.component';
import { PageNotFoundComponent } from './routes/page-not-found/page-not-found.component';
import { RoomComponent } from './routes/room/room.component';
import { ShowtimesComponent } from './routes/showtimes/showtimes.component';

const routes: Routes = [
  { path: '', redirectTo: '/movie', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '', component: NavbarComponent,
    children: [
      { path: 'movie', component: MovieComponent },
      //{ path: 'movie/movie-detail-view', component: RoomComponent },
      { path: 'movie/:id', component: MovieShowtimesComponent },
      { path: 'movie/showtimes/:id', component: RoomComponent },
      { path: 'showtimes', component: ShowtimesComponent },
      { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
