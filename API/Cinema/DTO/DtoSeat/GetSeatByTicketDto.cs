using System;
using System.Data;

namespace Cinema.DTO.DtoSeat
{
    public class GetSeatByTicketDto
    {
        public GetSeatByTicketDto(DataRow row)
        {
            Id = (Guid)row["Id"];
            Name = row["Name"].ToString();
        }
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}
