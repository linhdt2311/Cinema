using Cinema.DTO;
using Cinema.DTO.DtoBill;
using Cinema.DTO.DtoMovie;
using Cinema.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace Cinema.Controllers
{
    [ApiController]
    [Route("api/movie")]
    public class MovieController : DBConnect
    {
        [HttpGet("getall")]
        public List<MovieDto> GetAllMovie(string? name, string? country, string? director,DateTime? todate, DateTime? fromdate)
        {
            conn.Open();
            var nameMovie = string.IsNullOrWhiteSpace(name) ? "" : name;
            var countryMovie = string.IsNullOrWhiteSpace(country) ? "" : country;
            var directorMovie = string.IsNullOrWhiteSpace(director) ? "" : director;

            var toTime = string.IsNullOrWhiteSpace(todate.ToString()) ? null : todate.Value.ToString("yyyy-MM-dd");
            var FromTime = string.IsNullOrWhiteSpace(fromdate.ToString()) ? null : fromdate.Value.ToString("yyyy-MM-dd");
            string sql = string.Format("exec GetViewMovie @Name = '" + nameMovie + "',@Country ='" + countryMovie + "', @Director = '" + directorMovie + "', @ToDate ='" + toTime + "', @FromDate ='" + FromTime + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            DataTable data = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(sqlCommand);
            adapter.Fill(data);
            var movieList = new List<MovieDto>();
            foreach (DataRow i in data.Rows)
            {
                MovieDto movie = new MovieDto(i);
                movieList.Add(movie);
            }
            conn.Close();
            return movieList.ToList();
        }
        [HttpPost("search")]
        public List<MovieDto> SearchMovie(SearchMovieDto input)
        {
            conn.Open();
            string id = string.Format("00000000-0000-0000-0000-000000000000");
            if (input.movieId == null) input.movieId = new Guid(id);
            var countryMovie = string.IsNullOrWhiteSpace(input.country) ? "" : input.country;
            var directorMovie = string.IsNullOrWhiteSpace(input.director) ? "" : input.director;
            string sql = string.Format("exec SearchMovie @Id = '" + input.movieId + "',@Country ='" + countryMovie + "', @Director = '" + directorMovie + "', @ToDate ='" + input.startDate + "', @FromDate ='" + input.endDate + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            DataTable data = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(sqlCommand);
            adapter.Fill(data);
            var movieList = new List<MovieDto>();
            foreach (DataRow i in data.Rows)
            {
                MovieDto movie = new MovieDto(i);
                movieList.Add(movie);
            }
            conn.Close();
            return movieList.ToList();
        }

        [HttpGet("getthebestmovie")]
        public GetTop1Dto GetTheBestMovie(bool bestOrWorst)
        {
            conn.Open();
            string sql;
            if (bestOrWorst == true)
            {
                sql = string.Format("select top 1 m.Name as Name, count(m.Name) as Count from Ticket t " +
                "join Seat s on t.SeatId = s.Id join Showtimes st on st.Id = s.ShowtimesId " +
                "join Movie m on m.Id = st.MovieId " +
                "where t.IsDeleted <> 1 group by m.Name order by Count desc");
            } else
            {
                sql = string.Format("select top 1 m.Name as Name, count(m.Name) as Count from Ticket t " +
                "join Seat s on t.SeatId = s.Id join Showtimes st on st.Id = s.ShowtimesId " +
                "join Movie m on m.Id = st.MovieId " +
                "where t.IsDeleted <> 1 group by m.Name order by Count asc");
            }
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            DataTable data = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(sqlCommand);
            adapter.Fill(data);
            if (data.Rows.Count > 0)
                return new GetTop1Dto(data.Rows[0]);
            return null;
        }
        [HttpPost("create")]
        public bool CreateMovie(CreateMovieDto input)
        {
            conn.Open();
            string sql = string.Format("exec CreateMovie @CreatorUserId = '" + input.CreatorUserId + "', @Name = N'" + input.Name + "', @Time = '" + input.Time + "', @OpeningDay = '" + input.OpeningDay.ToString("yyyy-MM-dd") + "', @Country = N'" + input.Country + "', @Director = N'" + input.Director + "', @Description = N'" + input.Description + "', @Poster = '" + input.Poster + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpPut("update")]
        public bool UpdateMovie(UpdateMovieDto input)
        {
            conn.Open();
            string sql = string.Format("exec UpdateMovie @LastModifierUserId = '" + input.LastModifierUserId + "', @Id = '" + input.Id + "', @Name = N'" + input.Name + "', @Time = '" + input.Time + "', @OpeningDay = '" + input.OpeningDay.ToString("yyyy-MM-dd") + "', @Country = N'" + input.Country + "', @Director = N'" + input.Director + "', @Description = N'" + input.Description + "', @Poster = '" + input.Poster + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpDelete("delete")]
        public bool DeleteMovie(Guid deleterUserId, Guid id)
        {
            conn.Open();
            string sql = string.Format("update Movie set IsDeleted = 1, DeleteTime = getdate(), DeleterUserId = '" + deleterUserId + "' where Id = '" + id + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
    }
}
