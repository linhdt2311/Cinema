using System.Data;
using System;

namespace Cinema.DTO.DtoBill
{
    public class GetAllBillDto
    {
        public GetAllBillDto(DataRow row)
        {
            this.Id = (Guid)row["Id"];
            this.CustomerId = (Guid)row["CustomerId"];
            this.FoodId = (Guid)row["FoodId"];
            this.FoodNum = (int)row["FoodNum"];
            this.TicketId = (Guid)row["TicketId"];
            this.Cost = (int)row["Cost"];
        }
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public Guid FoodId { get; set; }
        public int FoodNum { get; set; }
        public Guid TicketId { get; set; }
        public int Cost { get; set; }
    }
}
