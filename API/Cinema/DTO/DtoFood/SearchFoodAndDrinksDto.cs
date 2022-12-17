using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cinema.DTO.DtoFood
{
    public class SearchFoodAndDrinksDto
    {
        public string name { get; set; }
        public List<Guid> cinemaId { get; set; }
        public int price { get; set; }
        public int size { get; set; }
    }
}
