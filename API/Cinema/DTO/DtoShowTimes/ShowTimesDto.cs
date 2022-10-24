using System;
using System.Data;

namespace Cinema.DTO
{
    public class ShowTimesDto
    {
        public ShowTimesDto(DataRow row)
        {
            this.TId = (int)row["TId"];
            this.MovieId = (int)row["MovieId"];
            this.TimeStart = (DateTime)row["TimeStart"];
            this.FormatMovieScreen = (int)row["FormatMovieScreen"];
        }
        public int TId { get; set; }
        public int MovieId { get; set; }
        public DateTime TimeStart { get; set; }
        public int FormatMovieScreen { get; set; }
    }
}
