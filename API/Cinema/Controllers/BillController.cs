using Cinema.Services;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using Cinema.DTO.DtoBill;
using Cinema.DTO;
using Cinema.DTO.DtoAccount;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Data;
using System;
using System.Linq;
using System.Net.Http;
using System.Globalization;

namespace Cinema.Controllers
{
    [ApiController]
    [Route("api/bill")]
    public class BillController : DBConnect
    {
        [HttpGet("getall")]
        public List<GetAllBillDto> GetAllBill(Guid? customerId, Guid? foodId, Guid? ticketId, int? cost)
        {
            conn.Open();
            string id = string.Format("00000000-0000-0000-0000-000000000000");
            if (customerId == null) customerId = new Guid(id);
            if (foodId == null) foodId = new Guid(id);
            if (ticketId == null) ticketId = new Guid(id);

            string sql = string.Format("exec GetViewBill @CustomerId = '" + customerId + "', @FoodId = '" + foodId + "', @TicketId = '" + ticketId + "', @Cost = '" + cost + "'");

            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            DataTable data = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(sqlCommand);
            adapter.Fill(data);
            var list = new List<GetAllBillDto>();
            foreach (DataRow i in data.Rows)
            {
                GetAllBillDto bill = new GetAllBillDto(i);
                list.Add(bill);
            }
            conn.Close();
            return list.ToList();
        }
        [HttpGet("getbill")]
        public BillDto GetBill(DateTime creationTime)
        {
            conn.Open();
            string sql = string.Format("select * from Bill where CreationTime between '" + creationTime.ToString("yyyy-MM-dd HH:mm:ss") + "' and '" + creationTime.AddSeconds(1).ToString("yyyy-MM-dd HH:mm:ss") + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            DataTable data = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(sqlCommand);
            adapter.Fill(data);
            if (data.Rows.Count > 0)
                return new BillDto(data.Rows[0]);
            return null;
        }
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
        [HttpPost("create-billdetail")]
        public bool CreateBillDetail(CreateBillDetailDto input)
        {
            conn.Open();
            string sql = string.Format("insert into BillDetail(CreationTime, CreatorUserId, IsDeleted, FoodId, BillId, Quantity) values (getdate(), '" + input.CreatorUserId + "', 0,'" + input.FoodId + "', '" + input.BillId + "', " + input.Quantity + ")");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpPut("update")]
        public bool Update(UpdateBillDto input)
        {
            conn.Open();
            string sql = string.Format("exec UpdateBill @LastModifierUserId = '" + input.LastModifierUserId + "', @Id = '" + input.Id + "', @Cost = " + input.Cost);
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
        [HttpDelete("deletebill")]
        public bool DeleteBill(Guid id)
        {
            conn.Open();
            string sql = string.Format("delete from Bill where Id = '" + id + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
    }
}
