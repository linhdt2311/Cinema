using Cinema.DTO.DtoFood;
using Cinema.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using Cinema.DTO;

namespace Cinema.Controllers
{
    [ApiController]
    [Route("api/food")]
    public class FoodController : DBConnect
    {
        [HttpGet("getall")]
        public List<GetAllFoodDto> GetAll(string name)
        {
            conn.Open();
            string sql = string.Format("exec GetAllFoodByCinema @CinemaId = '" + name+ "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            DataTable data = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(sqlCommand);
            adapter.Fill(data);
            var list = new List<GetAllFoodDto>();
            foreach (DataRow i in data.Rows)
            {
                GetAllFoodDto dto = new GetAllFoodDto(i);
                list.Add(dto);
            }
            conn.Close();
            return list.ToList();
        }
        [HttpPost("create")]
        public bool Create(CreateFoodDto input)
        {
            conn.Open();
            string sql = string.Format("exec CreateFood @CreatorUserId = '" + input.CreatorUserId + "', @CinemaId = '" + input.CinemaId + "', @Name = '" + input.Name + "', @Size = " + input.Size + ", @Price = " + input.Price);
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpPut("update")]
        public bool Update(UpdateFoodDto input)
        {
            conn.Open();
            string sql = string.Format("exec UpdateFood @LastModifierUserId = '" + input.LastModifierUserId + "', @Id = '" + input.Id + "', @CinemaId = '" + input.CinemaId + "', @Name = '" + input.Name + "', @Size = "+ input.Size + ", @Price = " + input.Price);
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpDelete("delete")]
        public bool Delete(DeleteDto input)
        {
            conn.Open();
            string sql = string.Format("update Food set IsDeleted = 1, DeleteTime = getdate(), DeleterUserId = '" + input.DeleterUserId + "' where Id = '" + input.Id + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
    }
}
