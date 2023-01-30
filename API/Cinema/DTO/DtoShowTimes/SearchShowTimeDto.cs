using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cinema.DTO.DtoShowTimes
{
    public class SearchShowTimeDto
    {
        public Guid? showtimesId { get; set; }
        public List<Guid>? cinemaId { get; set; }
        public Guid? movieId { get; set; }
        public string timeStart { get; set; }
        public string timeEnd { get; set; }
        public int? formatMovieScreen { get; set; }

        public List<Guid>? roomId { get; set; }
    }
}
