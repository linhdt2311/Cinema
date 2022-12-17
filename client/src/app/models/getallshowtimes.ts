export class GetAllShowtimes {
  id!: string;
  movieId!: string;
  timeStart!: Date;
  formatMovieScreen!: number | undefined;
  roomId!: string;
  cinemaId!: string;
}
export class SearchShowTime{
  id!: string;
  movieId!: string;
  //timeStart!: string |null;
  timeStart!:Date;
  timeEnd!: Date;
  formatMovieScreen!: number | undefined;
  roomId!: string;
  cinemaId: any[];
}
