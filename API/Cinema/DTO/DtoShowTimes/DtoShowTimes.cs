using System;
using System.Data;

namespace Cinema.DTO
{
    public class DtoShowTimes
    {
        public DtoShowTimes(DataRow row)
        {
            this.TId = (int)row["TId"];
            this.MId = (int)row["MId"];
            this.RId = (int)row["RId"];
            this.TTime = (DateTime)row["TTime"];
            this.TFormatMovieScreen = (string)row["TFormatMovieScreen"];
        }
        public int TId { get; set; }
        public int MId { get; set; }
        public int RId { get; set; }
        public DateTime? TTime { get; set; }
        public string TFormatMovieScreen { get; set; }
    }
}
