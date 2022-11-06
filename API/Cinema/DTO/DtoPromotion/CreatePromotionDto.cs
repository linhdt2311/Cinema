using System;

namespace Cinema.DTO.DtoPromotion
{
    public class CreatePromotionDto
    {
        public Guid CreatorUserId { get; set; }
        public string Code { get; set; }
        public Guid Discount { get; set; }
        public Guid StartDate { get; set; }
        public Guid EndDate { get; set; }
    }
}
