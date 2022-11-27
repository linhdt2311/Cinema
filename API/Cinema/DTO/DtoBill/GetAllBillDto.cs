using System.Data;
using System;

namespace Cinema.DTO.DtoBill
{
    public class GetAllBillDto
    {
        public GetAllBillDto(DataRow row)
        {
            this.Id = (Guid)row["Id"];
            this.CustomerId = (Guid)row["AccountId"];
            this.Cost = (int)row["Cost"];
        }
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public int Cost { get; set; }
    }
}
