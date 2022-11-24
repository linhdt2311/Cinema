using Cinema.DTO.DtoRoom;
using Cinema.Enum;
using Cinema.Services;
using Microsoft.AspNetCore.Mvc;
using System;
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
        public List<RoomDto> GetAllRoom(Guid? cinemaId, Guid? roomId, int? formatMovieScreen)
        {
            conn.Open();
            string id = string.Format("00000000-0000-0000-0000-000000000000");
            if (cinemaId == null) cinemaId = new Guid(id);
            if (roomId == null) roomId = new Guid(id);
            string sql = string.Format("exec GetAllRoomByCinema @CinemaId = '" + cinemaId + "', @RoomId = '" + roomId + "', @FormatMovieScreen = '" + formatMovieScreen + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            DataTable data = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(sqlCommand);
            adapter.Fill(data);
            var roomList = new List<RoomDto>();
            foreach (DataRow i in data.Rows)
            {
                RoomDto room = new RoomDto(i);
                roomList.Add(room);
            }
            conn.Close();
            return roomList.ToList();
        }
        [HttpPost("create")]
        public bool CreateRoom(int name, Guid creatorUserId, int formatMovieScreen)
        {
            conn.Open();
            string sql = string.Format("exec CreateRoom @CreatorUserId = '" + creatorUserId + "', @Name = '" + name + "', @FormatMovieScreen = '" + formatMovieScreen + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpPut("update")]
        public bool UpdateRoom(Guid Id, int name, int status, Guid lastModifierUserId)
        {
            conn.Open();
            string sql = string.Format("exec UpdateRoom @LastModifierUserId = '" + lastModifierUserId + "', @Id = '" + Id + "', @Name = '" + name + "', @Status = '" + status + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpDelete("delete")]
        public bool DeleteRoom(Guid id, Guid deleterUserId)
        {
            conn.Open();
            string sql = string.Format("update Room set IsDeleted = 1, DeleteTime = getdate(), DeleterUserId = '" + deleterUserId + "' where Id = '" + id + "'");

            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
    }
}
