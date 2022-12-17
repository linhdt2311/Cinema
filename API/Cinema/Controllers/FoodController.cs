using Cinema.DTO.DtoFood;
using Cinema.Services;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using Cinema.DTO;
using System;
using Cinema.DTO.DtoBill;

namespace Cinema.Controllers
{
    [ApiController]
    [Route("api/food")]
    public class FoodController : DBConnect
    {
        [HttpGet("getall")]
        public List<GetAllFoodDto> GetAll(Guid cinemaId, string? name, int? size)
        {
            conn.Open();
            string sql = string.Format("exec GetAllFoodByCinema @CinemaId = '" + cinemaId + "', @Name = '" + name + "', @Size = '" + size + "'");
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
        [HttpPost("search")]
        public List<GetAllFoodDto> Search(SearchFoodAndDrinksDto input)
        {
            conn.Open();
            string listId = input.cinemaId.Count >= 1 ? string.Join(",", input.cinemaId) : "00000000-0000-0000-0000-000000000000";
            string sql = string.Format("exec SearchFoodByCinema @CinemaId = '" + listId + "', @Name = '" + input.name + "', @Size = '" + input.size + "', @@Price = '" + input.price + "'");
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

        [HttpGet("getallbilldetail")]
        public List<GetAllBillDetailDto> GetAllBillDetail(Guid? foodId, Guid? billId, int? quantity)
        {
            conn.Open();
            string id = string.Format("00000000-0000-0000-0000-000000000000");
            if (foodId == null) foodId = new Guid(id);
            if (billId == null) billId = new Guid(id);
            string sql = string.Format("exec GetAllBillDetail @FoodId = '" + foodId + "', @BillId = '" + billId + "', @Quantity = '" + quantity + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            DataTable data = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(sqlCommand);
            adapter.Fill(data);
            var list = new List<GetAllBillDetailDto>();
            foreach (DataRow i in data.Rows)
            {
                GetAllBillDetailDto bill = new GetAllBillDetailDto(i);
                list.Add(bill);
            }
            conn.Close();
            return list.ToList();
        }
        [HttpPost("create")]
        public bool Create(CreateFoodDto input)
        {
            conn.Open();
            string sql = string.Format("exec CreateFood @CreatorUserId = '" + input.CreatorUserId + "', @CinemaId = '" + input.CinemaId + "', @Name = N'" + input.Name + "', @Size = '" + input.Size + "', @Price = " + input.Price + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpPut("update")]
        public bool Update(UpdateFoodDto input)
        {
            conn.Open();
            string sql = string.Format("exec UpdateFood @LastModifierUserId = '" + input.LastModifierUserId + "', @Id = '" + input.Id + "', @CinemaId = '" + input.CinemaId + "', @Name = N'" + input.Name + "', @Size = '" + input.Size + "', @Price = '" + input.Price + "'");
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
