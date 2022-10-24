using Cinema.DTO;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using Cinema.Services;
using Cinema.DTO.DtoCode;
using Cinema.Enum;
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
        public bool CreatePromotion(string code, int creatorUserId, int discount, DateTime startDay, DateTime endDay)
        {
            conn.Open();
            string sql = string.Format("exec CreatePromotion @CreatorUserId = " + creatorUserId + ", @Code = '" + code + "', @Discount = " + discount + ", @StartDay = '" + startDay + "', @EndDay = '" + endDay + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpPut("update")]
        public bool UpdatePromotion(int lastModifierUserId, int pId, string code, int discount, DateTime startDay, DateTime endDay)
        {
            conn.Open();
            string sql = string.Format("exec UpdatePromotion @LastModifierUserId = " + lastModifierUserId + ", @PId = " + pId + ", @Code = '" + code + "', @Discount = " + discount + ", @StartDay = '" + startDay + "', @EndDay = '" + endDay + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpDelete("delete")]
        public bool DeletePromotion(int deleterUserId, int pId)
        {
            conn.Open();
            string sql = string.Format("exec DeletePromotion @DeleterUserId = " + deleterUserId + ", @PId = " + pId);

            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
    }
}
