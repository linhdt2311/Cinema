using System;
using System.Data;

namespace Cinema.DTO
{
    public class ShowTimesDto
    {
        public ShowTimesDto(DataRow row)
        {
            this.Id = (Guid)row["Id"];
            this.MovieId = (int)row["MovieId"];
            this.TimeStart = (DateTime)row["TimeStart"];
            this.FormatMovieScreen = (int)row["FormatMovieScreen"];
            this.RoomId = (Guid)row["RoomId"];
        }
        public Guid Id { get; set; }
        public int MovieId { get; set; }
        public DateTime TimeStart { get; set; }
        public int FormatMovieScreen { get; set; }
        public Guid RoomId { get; set; }
    }
}
