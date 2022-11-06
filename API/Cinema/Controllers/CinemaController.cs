using Cinema.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using Cinema.DTO.DtoCinema;
using System.Linq;

namespace Cinema.Controllers
{
    [ApiController]
    [Route("api/cinema")]
    public class CinemaController : DBConnect
    {
        [HttpGet("getall")]
        public List<CinemaDto> GetAllCinema()
        {
            conn.Open();
            string sql = string.Format("select * from Cinema");

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
    }
}
