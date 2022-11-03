using Cinema.DTO.DtoFood;
using Cinema.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data;

namespace Cinema.Controllers
{
    [ApiController]
    [Route("api/food")]
    public class FoodController : DBConnect
    {
        [HttpGet("getall")]
        public List<GetAllDtoFood> GetAll(string name)
        {
            conn.Open();
            string sql = string.Format("exec GetAllFoodByCinema @CinemaId = '" + name+ "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            DataTable data = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(sqlCommand);
            adapter.Fill(data);
            var list = new List<GetAllDtoFood>();
            foreach (DataRow i in data.Rows)
            {
                GetAllDtoFood dto = new GetAllDtoFood(i);
                list.Add(dto);
            }
            conn.Close();
            return list.ToList();
        }
        [HttpPost("create")]
        public bool Create(Guid creatorUserId, Guid cinemaId,string name , int size , int price)
        {
            conn.Open();
            string sql = string.Format("exec CreateFood @CreatorUserId = '" + creatorUserId + "', @CinemaId = '" + cinemaId + "', @Name = '" + name + "', @Size = " + size + ", @Price = " + price);
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpPut("update")]
        public bool Update(Guid lastModifierUserId,Guid id, Guid cinemaId, string name , int size , int price)
        {
            conn.Open();
            string sql = string.Format("exec UpdateFood @LastModifierUserId = '" + lastModifierUserId + "', @Id = '" + id + "', @CinemaId = '" + cinemaId + "', @Name = '" + name + "', @Size = "+ size + ", @Price = " + price);
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpDelete("delete")]
        public bool Delete(Guid id, Guid deleterUserId)
        {
            conn.Open();
            string sql = string.Format("update Food set IsDeleted = 1, DeleteTime = getdate(), DeleterUserId = '" + deleterUserId + "' where Id = '" + id + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
    }
}
