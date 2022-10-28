using System;
using System.Data;

namespace Cinema.DTO.DtoRoom
{
    public class RoomDto
    {
        public RoomDto(DataRow row)
        {
            Id = (Guid)row["Id"];
            Name = (int)row["Room"];
            Cinema = row["Cinema"].ToString();
            Status = (int)row["Status"];
        }
        public Guid Id { get; set; }
        public int Name { get; set; }
        public string Cinema { get; set; }
        public int Status { get; set; }
    }
}
