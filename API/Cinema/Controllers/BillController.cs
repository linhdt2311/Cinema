using Cinema.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Cinema.DTO.DtoBill;
using System.Data;

namespace Cinema.Controllers
{
    [ApiController]
    [Route("api/bill")]
    public class BillController : DBConnect
    {
        [HttpPost("create")]
        public bool Create(Guid creatorUserId, Guid foodId, int foodNum, Guid ticketId, int cost)
        {
            conn.Open();
            string sql = string.Format("exec CreateBill @CreatorUserId = '" + creatorUserId + "', @FoodId = '" + foodId + "', @FoodNum = " + foodNum + ", @TicketId = '" + ticketId + "', @Cost = " + cost);
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpPut("update")]
        public bool Update(Guid lastModifierUserId,Guid id, Guid foodId, int foodNum, Guid ticketId, int cost)
        {
            conn.Open();
            string sql = string.Format("exec UpdateBill @LastModifierUserId = '" + lastModifierUserId + "', @Id = '" + id + "', @FoodId = '" + foodId + "', @FoodNum = " + foodNum + ", @TicketId = '" + ticketId + "', @Cost = " + cost);
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpDelete("delete")]
        public bool Delete(Guid id, Guid deleterUserId)
        {
            conn.Open();
            string sql = string.Format("update Bill set IsDeleted = 1, DeleteTime = getdate(), DeleterUserId = '" + deleterUserId + "' where Id = '" + id + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
    }
}
