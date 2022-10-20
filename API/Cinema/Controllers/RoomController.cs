using Cinema.DTO;
using Cinema.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
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
            string sql = string.Format("select * from GetAllRoom a where (@Name is null or @Name = 0 or r.RName = @Name) and (@Status is null or r.RStatus = @Status) and isnull(IsDeleted, 0) = 0");

            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            sqlCommand.Parameters.AddWithValue("@Name", name);
            sqlCommand.Parameters.AddWithValue("@Status", status);
            SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();

            var roomList = new List<Room>();
            while (sqlDataReader.Read())
            {
                var room = new Room();
                room.RId = (int)sqlDataReader["RId"];
                room.RName = (int)sqlDataReader["RName"];
                room.RStatus = (int)sqlDataReader["RStatus"];
                roomList.Add(room);
            }
            conn.Close();
            return roomList.ToList();
        }
        [HttpPost("create")]
        public bool CreateRoom(int name, int creatorUserId)
        {

            conn.Open();
            string SQL = string.Format("exec CreateRoom @CreatorUserId = _CreatorUserId, @RName = _RName");
            SqlCommand sqlCommand = new SqlCommand(SQL, conn);
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
            string check = string.Format("select * from Room where RId = @id and isDelete = 0");
            SqlCommand sqlCmd = new SqlCommand(check, conn);
            sqlCmd.Parameters.AddWithValue("@id", rId);
            SqlDataReader sqlDataReader = sqlCmd.ExecuteReader();
            if (sqlDataReader.HasRows)
            {
                conn.Close();
                return false;
            }
            conn.Close();
            conn.Open();
            string SQL = string.Format("exec UpdateRoom @LastModifierUserId = _LastModifierUserId, @RId = _RId, @RName = _RName, @RStatus = _RStatus");
            SqlCommand sqlCommand = new SqlCommand(SQL, conn);
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
            string check = string.Format("select * from Room where RId = @id and isDelete = 0");
            SqlCommand sqlCmd = new SqlCommand(check, conn);
            sqlCmd.Parameters.AddWithValue("@id", rId);
            SqlDataReader sqlDataReader = sqlCmd.ExecuteReader();
            if (sqlDataReader.HasRows)
            {
                conn.Close();
                return false;
            }
            conn.Close();
            conn.Open();
            string SQL = string.Format("exec DeleteRoom @DeleterUserId = _deleterUserId, @RId = _RId");

            SqlCommand sqlCommand = new SqlCommand(SQL, conn);
            sqlCommand.Parameters.AddWithValue("_DeleterUserId", deleterUserId);
            sqlCommand.Parameters.AddWithValue("_RId", rId);

            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
    }
}
