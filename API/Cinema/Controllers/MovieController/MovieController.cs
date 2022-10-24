using Cinema.DTO.DtoMovie;
using Cinema.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;

namespace Cinema.Controllers.Movie
{
    [ApiController]
    [Route("api/movie")]
    public class MovieController : DBConnect
    {
        [HttpGet("getall")]
        public List<MovieDto> GetAllMovie(string name, string country, int? genre, string director)
        {
            conn.Open();
            string sql = string.Format("exec GetViewMovie @Name = '" + name + "',@Country ='" + country + "', @Genre = '" + genre + "', @Director = '" + director + "'");
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
        [HttpPost("create")]
        public bool CreateMovie(string name, int creatorUserId, int time, DateTime openingDay, string country, string director, int genre, string description)
        {
            conn.Open();
            string sql = string.Format("exec CreateMovie @CreatorUserId = " + creatorUserId + ", @Name = '" + name + "', @Time = " +time + ", @OpeningDay = '" + openingDay + "', @Country = '" + country + "', @Director = '" + director + "', @Genre = " + genre + ", @Description = '" + description + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpPut("update")]
        public bool UpdateMovie(int lastModifierUserId, string name, int mId, int time, DateTime openingDay, string country, string director, int genre, string description, string poster)
        {
            conn.Open();
            string sql = string.Format("exec UpdateMovie @LastModifierUserId = " + lastModifierUserId + ", @MId = " + mId + ", @Name = '" + name + "', @Time = " + time + ", @OpeningDay = '" + openingDay + "', @Country = '" + country + "', @Director = '" + director + "', @Genre = " + genre + ", @Description = '" + description + "', @Poster = '" + poster + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpDelete("delete")]
        public bool DeleteMovie(int mId, int deleterUserId)
        {
            conn.Open();
            string sql = string.Format("exec DeleteMovie @DeleterUserId = " + deleterUserId + ", @MId = " + mId);
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
    }
}
