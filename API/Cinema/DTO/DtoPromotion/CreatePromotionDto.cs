using System;

namespace Cinema.DTO.DtoPromotion
{
    public class CreatePromotionDto
    {
        public Guid CreatorUserId { get; set; }
        public string Code { get; set; }
        public int Discount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
