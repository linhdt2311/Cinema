using Cinema.DTO;
using Cinema.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace Cinema.Controllers
{
    [ApiController]
    [Route("api/room")]
    public class RoomController : DBConnect
    {
        [HttpGet("getall")]
        public List<Room> GetAllRoom(int? RName, int? RStatus)
        {
            conn.Open();
            string sql = string.Format("exec GetViewRoom @RName = '" + RName + "',@RStatus ='" + RStatus + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            DataTable data = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(sqlCommand);
            adapter.Fill(data);
            var roomList = new List<Room>();
            foreach (DataRow i in data.Rows)
            {
                Room room = new Room(i);
                roomList.Add(room);
            }
            conn.Close();
            return roomList.ToList();
        }
        [HttpPost("create")]
        public bool CreateRoom(int name, int creatorUserId)
        {
            conn.Open();
            string sql = string.Format("exec CreateRoom @CreatorUserId = " + creatorUserId + ", @RName = " + name);
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpPut("update")]
        public bool UpdateRoom(int rId, int rName, int rStatus, int lastModifierUserId)
        {
            conn.Open();
            string sql = string.Format("exec UpdateRoom @LastModifierUserId = " + lastModifierUserId + ", @RId = " + rId + ", @RName = " + rName + ", @RStatus = " + rStatus);
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpDelete("delete")]
        public bool DeleteRoom(int rId, int deleterUserId)
        {
            conn.Open();
            string sql = string.Format("exec DeleteRoom @DeleterUserId = " + deleterUserId + ", @RId = " + rId);

            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
    }
}
