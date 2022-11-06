import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CinemaComponent } from './routes/cinema/cinema.component';
import { LoginComponent } from './routes/login/login.component';
import { MovieShowtimesComponent } from './routes/movie/movie-showtimes/movie-showtimes.component';
import { MovieComponent } from './routes/movie/movie.component';
import { NavbarComponent } from './routes/navbar/navbar.component';
import { PageNotFoundComponent } from './routes/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/movie', pathMatch: 'full' },
  {
    path: '', component: NavbarComponent,
    children: [
      { path: 'cinema', component: CinemaComponent },
      { path: 'movie', component: MovieComponent },
      { path: 'movie/:id', component: MovieShowtimesComponent, },
      { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
