using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cinema.DTO.DtoCinema
{
    public class SearchCinemaDto
    {
        public List<Guid> Id { get; set; }
        public string Quantity { get; set; }

    }
}
