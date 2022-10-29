using System;
using System.Data;

namespace Cinema.DTO
{
    public class ShowTimesDto
    {
        public ShowTimesDto(DataRow row)
        {
            this.Id = (Guid)row["Id"];
            this.MovieId = (Guid)row["MovieId"];
            this.TimeStart = (DateTime)row["TimeStart"];
            this.FormatMovieScreen = (int)row["FormatMovieScreen"];
            this.RoomId = (Guid)row["RoomId"];
            this.CinemaId = (Guid)row["CinemaId"];
        }
        public Guid Id { get; set; }
        public Guid MovieId { get; set; }
        public DateTime TimeStart { get; set; }
        public int FormatMovieScreen { get; set; }
        public Guid RoomId { get; set; }
        public Guid CinemaId { get; set; }
    }
}
