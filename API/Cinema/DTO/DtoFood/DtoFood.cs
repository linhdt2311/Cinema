using System;
using System.Data;

namespace Cinema.DTO.DtoFood
{
    public class DtoFood
    {
        public DtoFood(DataRow row)
        {
            this.Id = (Guid)row["Id"];
            this.Name = row["Name"].ToString();
            this.Size = (int)row["Size"];
            this.Price = (int)row["Price"];
            this.CinemaId = (Guid)row["CinemaId"];
        }
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Size { get; set; }
        public int Price { get; set; }
        public Guid CinemaId { get; set; }
    }
}
