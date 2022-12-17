using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cinema.DTO.DtoPromotion
{
    public class SearchPromotionDto
    {
        public List<Guid> id { get; set; }
        public int discount { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
    }
}
