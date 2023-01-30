using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cinema.DTO.DtoMovie
{
    public class SearchMovieDto
    {
        public Guid? movieId { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string country { get; set; }
        public string director { get; set; }

    }
}
