using Cinema.DTO;
using Cinema.DTO.DtoShowTimes;
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
        public List<ShowTimesDto> GetAllShowTimes(Guid? showtimesId, Guid? cinemaId, Guid? movieId, DateTime? timeStart, int? formatMovieScreen)
        {
            conn.Open();
            string id = string.Format("00000000-0000-0000-0000-000000000000");
            if (showtimesId == null) showtimesId = new Guid(id);
            if (cinemaId == null) cinemaId = new Guid(id);
            if (movieId == null) movieId = new Guid(id);
            var a = string.IsNullOrWhiteSpace(timeStart.ToString()) ? null : timeStart.Value.ToString("yyyy-MM-dd");
            
            string sql = string.Format("exec GetViewShowtimes @ShowtimesId = '" + showtimesId + "', @CinemaId = '" + cinemaId + "', @MovieId = '" + movieId + "', @TimeStart = '" + a + "', @FormatMovieScreen = '" + formatMovieScreen + "'");
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
        public bool CreateShowTime(CreateShowtimesDto input)
        {
            conn.Open();
            string sql = string.Format("exec CreateShowtimes @CreatorUserId = '" + input.CreatorUserId + "', @MovieId = '" + input.MovieId + "', @TimeStart = '" + input.TimeStart + "', @FormatMovieScreen = '" + input.FormatMovieScreen + "', @RoomId = '" + input.RoomId + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpPut("update")]
        public bool UpdateShowTime(UpdateShowtimesDto input)
        {
            conn.Open();
            string sql = string.Format("exec UpdateShowtimes @LastModifierUserId = '" + input.LastModifierUserId + "', @Id = '" + input.Id + "', @MovieId = '" + input.MovieId + "', @TimeStart = '" + input.TimeStart + "', @FormatMovieScreen = '" + input.FormatMovieScreen + "', @RoomId = '" + input.RoomId + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpDelete("delete")]
        public bool DeleteShowTime(DeleteDto input)
        {
            conn.Open();
            string sql = string.Format("update Showtimes set IsDeleted = 1, DeleteTime = getdate(), DeleterUserId = '" + input.DeleterUserId + "' where Id = '" + input.Id + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
    }
}
