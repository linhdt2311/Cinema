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
        public List<Room> GetAllRoom(int? name, int? status)
        {
            
            conn.Open();
            string sql = string.Format("select * from GetAllRoom");

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
            //SqlDataReader reader = sqlCommand.ExecuteReader();
            /*while (reader.Read())
            {
                var room = new Room();
                room.RId = (int)reader["RId"];
                room.RName = (int)reader["RName"];
                room.RStatus = (int)reader["RStatus"];
                roomList.Add(room);
            }*/
            conn.Close();
            return roomList.ToList();
        }
        [HttpPost("create")]
        public bool CreateRoom(int name, int creatorUserId)
        {
            conn.Open();
            string sql = string.Format("exec CreateRoom @CreatorUserId = _CreatorUserId, @RName = _RName");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            sqlCommand.Parameters.AddWithValue("_CreatorUserId", creatorUserId);
            sqlCommand.Parameters.AddWithValue("_RName", name);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpPut("update")]
        public bool UpdateRoom(int rId, int rName, int rStatus, int lastModifierUserId)
        {
            conn.Open();
            string sql = string.Format("exec UpdateRoom @LastModifierUserId = _LastModifierUserId, @RId = _RId, @RName = _RName, @RStatus = _RStatus");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            sqlCommand.Parameters.AddWithValue("_LastModifierUserId", lastModifierUserId);
            sqlCommand.Parameters.AddWithValue("_RId", rId);
            sqlCommand.Parameters.AddWithValue("_RName", rName);
            sqlCommand.Parameters.AddWithValue("_RStatus", rStatus);

            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpDelete("delete")]
        public bool DeleteRoom(int rId, int deleterUserId)
        {
            conn.Open();
            string sql = string.Format("exec DeleteRoom @DeleterUserId = _deleterUserId, @RId = _RId");

            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            sqlCommand.Parameters.AddWithValue("_DeleterUserId", deleterUserId);
            sqlCommand.Parameters.AddWithValue("_RId", rId);

            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
    }
}
