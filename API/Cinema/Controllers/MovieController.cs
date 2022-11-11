﻿using Cinema.DTO;
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
        public List<MovieDto> GetAllMovie(string name, string country, string director)
        {
            conn.Open();
            string sql = string.Format("exec GetViewMovie @Name = '" + name + "',@Country ='" + country + "', @Director = '" + director + "'");
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
        public bool CreateMovie(CreateMovieDto input)
        {
            conn.Open();
            string sql = string.Format("exec CreateMovie @CreatorUserId = '" + input.CreatorUserId + "', @Name = '" + input.Name + "', @Time = '" + input.Time + "', @OpeningDay = '" + input.OpeningDay + "', @Country = '" + input.Country + "', @Director = '" + input.Director + "', @Description = '" + input.Description + "', @Poster = '" + input.Poster + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpPut("update")]
        public bool UpdateMovie(UpdateMovieDto input)
        {
            conn.Open();
            string sql = string.Format("exec UpdateMovie @LastModifierUserId = '" + input.LastModifierUserId + "', @Id = '" + input.Id + "', @Name = '" + input.Name + "', @Time = '" + input.Time + "', @OpeningDay = '" + input.OpeningDay + "', @Country = '" + input.Country + "', @Director = '" + input.Director + "', @Description = '" + input.Description + "', @Poster = '" + input.Poster + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpDelete("delete")]
        public bool DeleteMovie(DeleteDto input)
        {
            conn.Open();
            string sql = string.Format("update Movie set IsDeleted = 1, DeleteTime = getdate(), DeleterUserId = '" + input.DeleterUserId + "' where Id = '" + input.Id + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
    }
}
