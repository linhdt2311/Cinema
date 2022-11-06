using System;

namespace Cinema.DTO.DtoBill
{
    public class UpdateBillDto
    {
        public Guid LastModifierUserId { get; set; }
        public Guid Id { get; set; }
        public int Cost { get; set; }
    }
}
