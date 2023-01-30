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
        public List<ShowTimesDto> GetAllShowTimes(Guid? showtimesId, Guid? cinemaId, Guid? movieId, DateTime? timeStart, int? format)
        {
            conn.Open();
            string id = string.Format("00000000-0000-0000-0000-000000000000");
            if (showtimesId == null) showtimesId = new Guid(id);
            if (cinemaId == null) cinemaId = new Guid(id);
            if (movieId == null) movieId = new Guid(id);
            var a = string.IsNullOrWhiteSpace(timeStart.ToString()) ? null : timeStart.Value.ToString("yyyy-MM-dd");
            
            string sql = string.Format("exec GetViewShowtimes @ShowtimesId = '" + showtimesId + "', @CinemaId = '" + cinemaId + "', @MovieId = '" + movieId + "', @TimeStart = '" + a + "', @FormatMovieScreen = '" + format + "'");
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
        
        [HttpPost("search")]
        public List<ShowTimesDto> SearchShowTime(SearchShowTimeDto input)
        {
            conn.Open();
            string id = string.Format("00000000-0000-0000-0000-000000000000");
            string list = input.cinemaId.Count >= 1? string.Join(",", input.cinemaId) :"00000000-0000-0000-0000-000000000000";
            string dataCinema = list.ToUpper();
            string listroom = input.roomId.Count >= 1 ? string.Join(",", input.roomId) : "00000000-0000-0000-0000-000000000000";
            string dataroom = listroom.ToUpper();
            if (input.showtimesId == null) input.showtimesId = new Guid(id);
            if (input.movieId == null) input.movieId = new Guid(id);
            string sql = string.Format("exec SearchShowtimes @ShowtimesId = '" + input.showtimesId + "', @CinemaId = '" + dataCinema + "', @MovieId = '" + input.movieId + "', @TimeStart = '" + input.timeStart + "', @TimeEnd = '" + input.timeEnd + "', @FormatMovieScreen = '" + input.formatMovieScreen + "' , @RoomId = '" + dataroom + "'");
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

        [HttpGet("getthebesttime")]
        public GetTop1Dto GetTheBestTime()
        {
            conn.Open();
            string sql = string.Format("select top 1 convert(varchar, st.TimeStart, 0) as Name, count(convert(varchar, st.TimeStart, 0)) as Count " +
                "from Ticket t join Seat s on t.SeatId = s.Id join Showtimes st on st.Id = s.ShowtimesId " +
                "where t.IsDeleted <> 1 group by convert(varchar, st.TimeStart, 0) order by Count desc");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            DataTable data = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(sqlCommand);
            adapter.Fill(data);
            if (data.Rows.Count > 0)
                return new GetTop1Dto(data.Rows[0]);
            return null;
        }
        [HttpPost("create")]
        public bool CreateShowTime(CreateShowtimesDto input)
        {
            conn.Open();
            string sql = string.Format("exec CreateShowtimes @CreatorUserId = '" + input.CreatorUserId + "', @MovieId = '" + input.MovieId + "', @TimeStart = '" + input.TimeStart + "', @RoomId = '" + input.RoomId + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpPut("update")]
        public bool UpdateShowTime(UpdateShowtimesDto input)
        {
            conn.Open();
            string sql = string.Format("exec UpdateShowtimes @LastModifierUserId = '" + input.LastModifierUserId + "', @Id = '" + input.Id + "', @MovieId = '" + input.MovieId + "', @TimeStart = '" + input.TimeStart + "', @RoomId = '" + input.RoomId + "'");
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
