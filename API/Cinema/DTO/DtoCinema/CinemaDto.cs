using System.Data;
using System;

namespace Cinema.DTO.DtoCinema
{
    public class CinemaDto
    {
        public CinemaDto(DataRow row)
        {
            this.Id = (Guid)row["Id"];
            this.Name = row["Name"].ToString();
        }
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}
