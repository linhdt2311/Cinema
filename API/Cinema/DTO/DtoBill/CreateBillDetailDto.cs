using System;

namespace Cinema.DTO.DtoBill
{
    public class CreateBillDetailDto
    {
        public Guid BillId { get; set; }
        public Guid CreatorUserId { get; set; }
        public Guid FoodId { get; set; }
        public int Quantity { get; set; }
    }
}
