using Cinema.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using Cinema.DTO.DtoCinema;
using System.Linq;
using Cinema.DTO;

namespace Cinema.Controllers
{
    [ApiController]
    [Route("api/cinema")]
    public class CinemaController : DBConnect
    {
        [HttpGet("getall")]
        public List<CinemaDto> GetAll(string name)
        {
            conn.Open();
            string sql = string.Format("exec GetViewCinema @Name = '" + name + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            DataTable data = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(sqlCommand);
            adapter.Fill(data);
            var cinemaList = new List<CinemaDto>();
            foreach (DataRow i in data.Rows)
            {
                CinemaDto cinema = new CinemaDto(i);
                cinemaList.Add(cinema);
            }
            conn.Close();
            return cinemaList.ToList();
        }
        [HttpGet("getthebestcinema")]
        public GetTop1Dto GetTheBestCinema(bool bestOrWorst)
        {
            conn.Open();
            string sql;
            if (bestOrWorst == true)
            {
                sql = string.Format("select top 1 c.Name as Name, count(c.Name) as Count from Ticket t " +
                "join Seat s on t.SeatId = s.Id join Showtimes st on st.Id = s.ShowtimesId " +
                "join Room r on r.Id = st.RoomId join Cinema c on c.Id = r.CinemaId " +
                "where t.IsDeleted <> 1 group by c.Name order by Count desc");
            }
            else
            {
                sql = string.Format("select top 1 c.Name as Name, count(c.Name) as Count from Ticket t " +
                "join Seat s on t.SeatId = s.Id join Showtimes st on st.Id = s.ShowtimesId " +
                "join Room r on r.Id = st.RoomId join Cinema c on c.Id = r.CinemaId " +
                "where t.IsDeleted <> 1 group by c.Name order by Count asc");
            }
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            DataTable data = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(sqlCommand);
            adapter.Fill(data);
            if (data.Rows.Count > 0)
                return new GetTop1Dto(data.Rows[0]);
            return null;
        }
        [HttpGet("getrevenueforcinema")]
        public List<GetTop1Dto> GetRevenueForCinema()
        {
            conn.Open();
            string sql = string.Format("select c.Name as Name, sum(b.Cost) as Count from Bill b " +
                "join Ticket t on t.BillId = b.Id join Seat s on s.Id = t.SeatId " +
                "join Showtimes st on st.Id = s.ShowtimesId join Room r on r.Id = st.RoomId " +
                "join Cinema c on c.Id = r.CinemaId group by c.Name");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            DataTable data = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(sqlCommand);
            adapter.Fill(data);
            var list = new List<GetTop1Dto>();
            foreach (DataRow i in data.Rows)
            {
                GetTop1Dto cinema = new GetTop1Dto(i);
                list.Add(cinema);
            }
            conn.Close();
            return list.ToList();
        }
    }
}
