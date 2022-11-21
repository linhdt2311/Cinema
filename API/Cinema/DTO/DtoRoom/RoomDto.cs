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
            CinemaId = (Guid)row["CinemaId"];
            Status = (int)row["Status"];
        }
        public Guid Id { get; set; }
        public int Name { get; set; }
        public Guid CinemaId { get; set; }
        public int Status { get; set; }
    }
}
