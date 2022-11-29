using System;
using System.Data;

namespace Cinema.DTO.DtoFood
{
    public class GetAllBillDetailDto
    {
        public GetAllBillDetailDto(DataRow row)
        {
            this.FoodId = (Guid)row["FoodId"];
            this.BillId = (Guid)row["BillId"];
            this.Quantity = (int)row["Quantity"];
        }
        public Guid FoodId { get; set; }
        public Guid BillId { get; set; }
        public int Quantity { get; set; }
    }
}
