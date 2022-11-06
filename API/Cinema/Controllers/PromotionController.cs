using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using Cinema.Services;
using Cinema.DTO.DtoCode;
using System.Linq;
using System;
using Cinema.DTO.DtoPromotion;
using Cinema.DTO;

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
        public bool CreatePromotion(CreatePromotionDto input)
        {
            conn.Open();
            string sql = string.Format("exec CreatePromotion @CreatorUserId = '" + input.CreatorUserId + "', @Code = '" + input.Code + "', @Discount = '" + input.Discount + "', @StartDay = '" + input.StartDate + "', @EndDay = '" + input.EndDate + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpPut("update")]
        public bool UpdatePromotion(UpdatePromotionDto input)
        {
            conn.Open();
            string sql = string.Format("exec UpdatePromotion @LastModifierUserId = '" + input.LastModifierUserId + "', @Id = '" + input.Id + "', @Code = '" + input.Code + "', @Discount = '" + input.Discount + "', @StartDay = '" + input.StartDate + "', @EndDay = '" + input.EndDate + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpDelete("delete")]
        public bool DeletePromotion(DeleteDto input)
        {
            conn.Open();
            string sql = string.Format("update Promotion set IsDeleted = 1, DeleteTime = getdate(), DeleterUserId = '" + input.DeleterUserId + "' where Id = '" + input.Id + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
    }
}
