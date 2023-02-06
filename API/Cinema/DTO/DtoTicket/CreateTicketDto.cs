using System;

namespace Cinema.DTO.DtoTicket
{
    public class CreateTicketDto
    {
        public Guid CreatorUserId { get; set; }
        public Guid SeatId { get; set; }
        public int Price { get; set; }
    }
}
