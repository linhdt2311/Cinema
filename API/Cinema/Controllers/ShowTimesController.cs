using Cinema.DTO;
using Cinema.Enum;
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
    [Route("api/showtimes")]
    public class ShowTimesController : DBConnect
    {
        [HttpGet("getall")]
        public List<ShowTimesDto> GetAllShowTimes(string movieName, DateTime? timeStart, int? formatMovieScreen, string CinemaName)
        {
            conn.Open();
            string sql = string.Format("exec GetViewShowtimes @CinemaName = '" + CinemaName + "', @MovieName = '" + movieName + "', @TimeStart = '" + timeStart + "', @FormatMovieScreen = '" + formatMovieScreen + "'");
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
        public bool CreateShowTime(Guid movieId, Guid creatorUserId, DateTime timeStart, int formatMovieScreen, Guid roomId)
        {
            conn.Open();
            string sql = string.Format("exec CreateShowtimes @CreatorUserId = '" + creatorUserId + "', @MovieId = '" + movieId + "', @TimeStart = '" + timeStart + "', @FormatMovieScreen = '" + formatMovieScreen + "', @RoomId = '" + roomId + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpPut("update")]
        public bool UpdateShowTime(Guid lastModifierUserId, Guid id, Guid movieId, DateTime timeStart, int formatMovieScreen, Guid roomId)
        {
            conn.Open();
            string sql = string.Format("exec UpdateShowtimes @LastModifierUserId = '" + lastModifierUserId + "', @Id = '" + id + "', @MovieId = '" + movieId + "', @TimeStart = '" + timeStart + "', @FormatMovieScreen = '" + formatMovieScreen + "', @RoomId = '" + roomId + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpDelete("delete")]
        public bool DeleteShowTime(Guid id, Guid deleterUserId)
        {
            conn.Open();
            string sql = string.Format("update Showtimes set IsDeleted = 1, DeleteTime = getdate(), DeleterUserId = '" + deleterUserId + "' where Id = '" + id + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
    }
}
