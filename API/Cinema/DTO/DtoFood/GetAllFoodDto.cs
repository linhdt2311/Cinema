using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Cinema.DTO.DtoFood
{
    public class GetAllFoodDto
    {
        public GetAllFoodDto(DataRow row)
        {
            this.CinemaId = (Guid)row["CinemaId"];
            this.Id = (Guid)row["Id"];
            this.Name = row["Name"].ToString();
            this.Size = (int)row["Size"];
            this.Price = (int)row["Price"];
        }
        public Guid Id { get; set; }
        public Guid CinemaId { get; set; }
        public string Name { get; set; }
        public int Size { get; set; }
        public int Price { get; set; }
    }
}
