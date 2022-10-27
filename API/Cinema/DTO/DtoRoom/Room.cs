using System;
using System.Data;

namespace Cinema.DTO.DtoRoom
{
    public class Room
    {
        public Room(DataRow row)
        {
            Id = (Guid)row["Id"];
            Name = (int)row["Name"];
            CinemaId = (Guid)row["CinemaId"];
            Status = (int)row["Status"];
        }
        public Guid Id { get; set; }
        public int Name { get; set; }
        public Guid CinemaId { get; set; }
        public int Status { get; set; }
    }
}
