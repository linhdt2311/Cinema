using System;

namespace Cinema.DTO.DtoBill
{
    public class CreateBillDto
    {
        public Guid CreatorUserId { get; set; }
        public Guid AccountId { get; set; }
    }
}
