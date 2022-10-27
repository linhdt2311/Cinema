using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Cinema.DTO.DtoCode
{
    public class PromotionDto
    {
        public PromotionDto(DataRow row)
        {
            this.Id = (Guid)row["Id"];
            this.Code = row["Code"].ToString();
            this.Discount = (int)row["Discount"];
            this.StartDay = (DateTime)row["StartDay"];
            this.EndDay = (DateTime)row["EndDay"];

        }
        public Guid Id { get; set; }
        public string Code { get; set; }
        public int Discount { get; set; }
        public DateTime StartDay { get; set; }
        public DateTime EndDay { get; set; }
    }
}
