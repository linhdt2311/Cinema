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
        public List<MovieDto> GetAllMovie(string? name, string? country, int? genre, string? director)
        {
            conn.Open();
            string sql = string.Format("exec GetViewMovie @MName = '" + name + "',@MCountry ='" + country + "', @MGenre = '" + genre + "', @MDirector = '" + director + "'");
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
        public bool CreateMovie(string name, int creatorUserId, int MTime, DateTime MOpeningDay, string MCountry, string MDirector, int MGenre, string MDescription)
        {
            conn.Open();
            string sql = string.Format("exec CreateMovie @CreatorUserId = " + creatorUserId + ", @MName = " + name + ", @MTime = " + MTime + ", @MOpeningDay = " + MOpeningDay + ", @MCountry = " + MCountry + ", @MDirector = " + MDirector + ", @MGenre = " + MGenre + ", @MDescription = " + MDescription);
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpPut("update")]
        public bool UpdateMovie(int lastModifierUserId, string name, int MId, int MTime, DateTime MOpeningDay, string MCountry, string MDirector, int MGenre, string MDescription)
        {
            conn.Open();
            string sql = string.Format("exec UpdateMoive @LastModifierUserId = " + lastModifierUserId + ", @MId = " + MId + ", @MName = " + name + ", @MTime = " + MTime + ", @MOpeningDay = " + MOpeningDay + ", @MCountry = " + MCountry + ", @MDirector = " + MDirector + ", @MGenre = " + MGenre + ", @MDescription = " + MDescription);
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpDelete("delete")]
        public bool DeleteMovie(int MId, int deleterUserId)
        {
            conn.Open();
            string sql = string.Format("exec DeleteMovie @DeleterUserId = " + deleterUserId + ", @MId = " + MId);
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
    }
}
