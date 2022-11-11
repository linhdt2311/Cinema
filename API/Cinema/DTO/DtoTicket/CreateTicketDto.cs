using System;

namespace Cinema.DTO.DtoTicket
{
    public class CreateTicketDto
    {
        public Guid CreatorUserId { get; set; }
        public Guid SeatId { get; set; }
        public int Price { get; set; }
        public Guid? PromotionId { get; set; }
        public Guid BillId { get; set; }
    }
}
