using System;
using System.Data;

namespace Cinema.DTO.DtoBill
{
    public class BillDto
    {
        public BillDto(DataRow row)
        {
            this.Id = (Guid)row["Id"];
        }
        public Guid Id { get; set; }
    }
}
