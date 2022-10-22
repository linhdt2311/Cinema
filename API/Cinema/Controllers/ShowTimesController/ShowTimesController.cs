using Cinema.DTO;
using Cinema.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace Cinema.Controllers.ShowTimesController
{
    [ApiController]
    [Route("api/showtime")]
    public class ShowTimeController : DBConnect
    {
        [HttpGet("getall")]
        public List<ShowTimesDto> GetAllShowTime(int? MId, int? RId , string? TTime)
        {
            conn.Open();
            string sql = string.Format("exec GetViewShowTime @MId = '" + MId + "',@RId ='" + RId + "',@TTime ='"+ TTime+"'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            DataTable data = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(sqlCommand);
            adapter.Fill(data);
            var movieList = new List<ShowTimesDto>();
            foreach (DataRow i in data.Rows)
            {
                ShowTimesDto movie = new ShowTimesDto(i);
                movieList.Add(movie);
            }
            conn.Close();
            return movieList.ToList();
        }
        [HttpPost("create")]
        public bool CreateShowTime(int MId, int creatorUserId, int RId, string TTimme, int TFormatMovieScreen)
        {
            conn.Open();
            string sql = string.Format("exec CreateShowtimes @CreatorUserId = " + creatorUserId + ", @MId = " + MId + ", @RId = " + RId + ", @TTimme = '" + TTimme + "', @TFormatMovieScreen = " + TFormatMovieScreen);
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpPut("update")]
        public bool UpdateShowTime(int lastModifierUserId, int TId ,int  MId ,int  RId , string TTime ,int  TFormatMovieScreen)
        {
            conn.Open();
            string sql = string.Format("exec UpdateShowtimes @LastModifierUserId = " + lastModifierUserId + ", @TId = " + TId + ", @MId = " + MId + ", @RId = " + RId + ", @TTime = '" + TTime + "', @TFormatMovieScreen = " + TFormatMovieScreen );
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpDelete("delete")]
        public bool DeleteShowTime(int TId, int deleterUserId)
        {
            conn.Open();
            string sql = string.Format("exec DeleteShowtimes @DeleterUserId = " + deleterUserId + ", @TId = " + TId);
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
    }
}
