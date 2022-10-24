using Cinema.DTO;
using Cinema.Enum;
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
    [Route("api/showtimes")]
    public class ShowTimesController : DBConnect
    {
        [HttpGet("getall")]
        public List<ShowTimesDto> GetAllShowTimes(int? movieId, DateTime? timeStart, int? formatMovieScreen)
        {
            conn.Open();
            string sql = string.Format("exec GetViewShowtimes @MovieId = '" + movieId + "', @TimeStart = '" + timeStart + "', @FormatMovieScreen = '" + formatMovieScreen + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            DataTable data = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(sqlCommand);
            adapter.Fill(data);
            var showtimesList = new List<ShowTimesDto>();
            foreach (DataRow i in data.Rows)
            {
                ShowTimesDto showtimes = new ShowTimesDto(i);
                showtimesList.Add(showtimes);
            }
            conn.Close();
            return showtimesList.ToList();
        }
        [HttpPost("create")]
        public bool CreateShowTime(int MovieId, int creatorUserId, DateTime TimeStart, int FormatMovieScreen, int RoomName)
        {
            conn.Open();
            string sql = string.Format("exec CreateShowtimes @CreatorUserId = " + creatorUserId + ", @MovieId = " + MovieId + ", @TimeStart = '" + TimeStart + "', @FormatMovieScreen = '" + FormatMovieScreen + "', @RoomName = " + RoomName);
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpPut("update")]
        public bool UpdateShowTime(int lastModifierUserId, int TId ,int MovieId, DateTime @TimeStart, int  FormatMovieScreen)
        {
            conn.Open();
            string sql = string.Format("exec UpdateShowtimes @LastModifierUserId = " + lastModifierUserId + ", @TId = " + TId + ", @MovieId = " + MovieId + ", @TimeStart = '" + @TimeStart + "', @FormatMovieScreen = " + FormatMovieScreen );
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
