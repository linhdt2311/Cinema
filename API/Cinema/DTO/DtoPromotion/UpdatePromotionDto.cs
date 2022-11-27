using System;

namespace Cinema.DTO.DtoPromotion
{
    public class UpdatePromotionDto
    {
        public Guid LastModifierUserId { get; set; }
        public Guid Id { get; set; }
        public string Code { get; set; }
        public int Discount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
