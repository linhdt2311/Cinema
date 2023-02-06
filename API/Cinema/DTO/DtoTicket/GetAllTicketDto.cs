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
            this.PromotionId = row["PromotionId"].ToString();
            this.BillId = row["BillId"] == null ? (Guid)row["BillId"] : null;
            this.CreatorUserId = (Guid)row["CreatorUserId"];
            this.CreationTime = (DateTime)row["CreationTime"];
        }
        public Guid Id { get; set; }    
        public DateTime Date { get; set; }
        public Guid SeatId { get; set; }
        public int Price { get; set; }
        public string PromotionId { get; set; }
        public Guid? BillId { get; set; }
        public Guid CreatorUserId { get; set; }
        public DateTime CreationTime { get; set; }
    }
}
