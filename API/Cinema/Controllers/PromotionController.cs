using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using Cinema.Services;
using Cinema.DTO.DtoCode;
using System.Linq;
using System;

namespace Cinema.Controllers
{
    [ApiController]
    [Route("api/promotion")]
    public class PromotionController : DBConnect
    {
        [HttpGet("getall")]
        public List<PromotionDto> GetAllPromotionDto()
        {
            conn.Open();
            string sql = string.Format("select * from GetAllPromotion");

            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            DataTable data = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(sqlCommand);
            adapter.Fill(data);
            var promotionList = new List<PromotionDto>();
            foreach (DataRow i in data.Rows)
            {
                PromotionDto promotion = new PromotionDto(i);
                promotionList.Add(promotion);
            }
            conn.Close();
            return promotionList.ToList();
        }
        [HttpPost("create")]
        public bool CreatePromotion(string code, Guid creatorUserId, int discount, DateTime startDate, DateTime endDate)
        {
            conn.Open();
            string sql = string.Format("exec CreatePromotion @CreatorUserId = '" + creatorUserId + "', @Code = '" + code + "', @Discount = '" + discount + "', @StartDay = '" + startDate + "', @EndDay = '" + endDate + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpPut("update")]
        public bool UpdatePromotion(Guid lastModifierUserId, Guid id, string code, int discount, DateTime startDate, DateTime endDate)
        {
            conn.Open();
            string sql = string.Format("exec UpdatePromotion @LastModifierUserId = '" + lastModifierUserId + "', @Id = '" + id + "', @Code = '" + code + "', @Discount = '" + discount + "', @StartDay = '" + startDate + "', @EndDay = '" + endDate + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpDelete("delete")]
        public bool DeletePromotion(Guid deleterUserId, Guid id)
        {
            conn.Open();
            string sql = string.Format("update Promotion set IsDeleted = 1, DeleteTime = getdate(), DeleterUserId = '" + deleterUserId + "' where Id = '" + id + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
    }
}
