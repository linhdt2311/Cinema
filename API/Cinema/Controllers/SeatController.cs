using Cinema.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System;
using Cinema.DTO.DtoSeat;
using System.Linq;

namespace Cinema.Controllers
{
    [ApiController]
    [Route("api/seat")]
    public class SeatController : DBConnect
    {
        [HttpGet("getall")]
        public List<SeatDto> GetAllSeat(Guid showtimesId)
        {
            conn.Open();
            string sql = string.Format("exec GetAllSeatByRoom @ShowtimesId = '" + showtimesId + "'");

            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            DataTable data = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(sqlCommand);
            adapter.Fill(data);
            var seatList = new List<SeatDto>();
            foreach (DataRow i in data.Rows)
            {
                SeatDto seat = new SeatDto(i);
                seatList.Add(seat);
            }
            conn.Close();
            return seatList.ToList();
        }
    }
}
