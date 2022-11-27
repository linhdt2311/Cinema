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
            this.CreationTime = (DateTime)row["CreationTime"];
            this.Cost = (int)row["Cost"];
        }
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public DateTime CreationTime { get; set; }
        public int Cost { get; set; }
    }
}
