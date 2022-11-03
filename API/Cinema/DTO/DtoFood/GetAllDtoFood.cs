using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Cinema.DTO.DtoFood
{
    public class GetAllDtoFood
    {
        public GetAllDtoFood(DataRow row)
        {
            this.Cinema = row["Cinema"].ToString();
            this.Food = row["Food"].ToString();
            this.Size = (int)row["Size"];
            this.Price = (int)row["Price"];
        }
        public string Cinema { get; set; }
        public string Food { get; set; }
        public int Size { get; set; }
        public int Price { get; set; }
    }
}
