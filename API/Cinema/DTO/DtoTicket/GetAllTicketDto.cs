using System;
using System.Data;

namespace Cinema.DTO.DtoTicket
{
    public class GetAllTicketDto
    {
        public GetAllTicketDto(DataRow row)
        {
            this.Id = (Guid)row["Id"];
            this.Date = (DateTime)row["Date"];
            this.SeatId = (Guid)row["SeatId"];
            this.Price = (int)row["Price"];
            this.PromotionId = (Guid)row["PromotionId"];
            this.BillId = (Guid)row["BillId"];
        }
        public Guid Id { get; set; }
        public DateTime Date { get; set; }
        public Guid SeatId { get; set; }
        public int Price { get; set; }
        public Guid PromotionId { get; set; }
        public Guid BillId { get; set; }
    }
}
