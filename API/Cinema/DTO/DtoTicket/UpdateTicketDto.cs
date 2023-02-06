using System;

namespace Cinema.DTO.DtoTicket
{
    public class UpdateTicketDto
    {
        public Guid LastModifierUserId { get; set; }
        public DateTime Date { get; set; }
        public Guid SeatId { get; set; }
        public int Price { get; set; }
        public Guid? PromotionId { get; set; }
        public Guid BillId { get; set; }
    }
}
