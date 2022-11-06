using Cinema.Services;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using Cinema.DTO.DtoBill;
using Cinema.DTO;

namespace Cinema.Controllers
{
    [ApiController]
    [Route("api/bill")]
    public class BillController : DBConnect
    {
        [HttpPost("create")]
        public bool Create(CreateBillDto input)
        {
            conn.Open();
            string sql = string.Format("exec CreateBill @CreatorUserId = '" + input.CreatorUserId + "', @AccountId = '" + input.AccountId + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpPut("update")]
        public bool Update(UpdateBillDto input)
        {
            conn.Open();
            string sql = string.Format("exec UpdateBill @LastModifierUserId = '" + input.LastModifierUserId + "', @Id = '" + input.Id + "', @Cost = " + input.Cost + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpDelete("delete")]
        public bool Delete(DeleteDto input)
        {
            conn.Open();
            string sql = string.Format("update Bill set IsDeleted = 1, DeleteTime = getdate(), DeleterUserId = '" + input.DeleterUserId + "' where Id = '" + input.Id + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
    }
}
