using System;

namespace Cinema.DTO.DtoPromotion
{
    public class UpdatePromotionDto
    {
        public Guid LastModifierUserId { get; set; }
        public Guid Id { get; set; }
        public string Code { get; set; }
        public Guid Discount { get; set; }
        public Guid StartDate { get; set; }
        public Guid EndDate { get; set; }
    }
}
