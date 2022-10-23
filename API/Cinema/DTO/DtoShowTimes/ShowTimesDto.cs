using System;
using System.Data;

namespace Cinema.DTO
{
    public class ShowTimesDto
    {
        public ShowTimesDto(DataRow row)
        {
            this.TId = (int)row["TId"];
            this.MId = (int)row["MId"];
            this.RId = (int)row["RId"];
            this.TTime = (DateTime)row["TTime"];
            this.TFormatMovieScreen = (int)row["TFormatMovieScreen"];
        }
        public int TId { get; set; }
        public int MId { get; set; }
        public int RId { get; set; }
        public DateTime? TTime { get; set; }
        public int TFormatMovieScreen { get; set; }
    }
}
