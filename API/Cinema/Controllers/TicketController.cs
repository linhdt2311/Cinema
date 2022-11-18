using Cinema.DTO.DtoShowTimes;
using Cinema.DTO;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System;
using Cinema.Services;
using System.Linq;
using Cinema.DTO.DtoTicket;

namespace Cinema.Controllers
{
    [ApiController]
    [Route("api/ticket")]
    public class TicketController : DBConnect
    {
        [HttpGet("getall")]
        public List<GetAllTicketDto> GetAllTicket(DateTime date, Guid? promotionId)
        {
            conn.Open();
            string id = string.Format("00000000-0000-0000-0000-000000000000");
            if (promotionId == null) promotionId = new Guid(id);
            string res  = date.ToString("yyyy-MM-dd HH:mm:ss") == string.Format("0001-01-01 00:00:00") ? "null" : string.Format("'" + date + "'");
            string sql = string.Format("exec GetViewTicket @Date = " + res + ", @PromotionId = '" + promotionId + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            DataTable data = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(sqlCommand);
            adapter.Fill(data);
            var list = new List<GetAllTicketDto>();
            foreach (DataRow i in data.Rows)
            {
                GetAllTicketDto ticket = new GetAllTicketDto(i);
                list.Add(ticket);
            }
            conn.Close();
            return list.ToList();
        }
        [HttpPost("create")]
        public bool CreateTicket(CreateTicketDto input)
        {
            conn.Open();
            string id = string.Format("00000000-0000-0000-0000-000000000000");
            if (input.PromotionId == null) input.PromotionId = new Guid(id);
            string sql = string.Format("exec CreateTicket @CreatorUserId = '" + input.CreatorUserId + "', @SeatId = '" + input.SeatId + "', @Price = " + input.Price + ", @PromotionId = '" + input.PromotionId + "', @BillId = '" + input.BillId + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpPut("update")]
        public bool UpdateTicket(UpdateTicketDto input)
        {
            conn.Open();
            string sql = string.Format("exec UpdateTicket @LastModifierUserId = '" + input.LastModifierUserId + "', @Id = '" + input.Id + "', @Date = '" + input.Date + "', @SeatId = '" + input.SeatId + "', @Price = '" + input.Price + "', @PromotionId = '" + input.PromotionId + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpDelete("delete")]
        public bool DeleteTicket(DeleteDto input)
        {
            conn.Open();
            string sql = string.Format("update Ticket set IsDeleted = 1, DeleteTime = getdate(), DeleterUserId = '" + input.DeleterUserId + "' where Id = '" + input.Id + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
    }
}
