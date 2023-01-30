using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cinema.DTO.DtoAccount
{
    public class SearchCustomerDto
    {
        public Guid? id { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public int discountTo { get; set; }
        public int discountFrom { get; set; }
    }
}
