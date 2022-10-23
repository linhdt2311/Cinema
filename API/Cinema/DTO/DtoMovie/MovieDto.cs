using System;
using System.Data;

namespace Cinema.DTO.DtoMovie
{
    public class MovieDto
    {
        public MovieDto(DataRow row)
        {
            this.MId = (int)row["MId"];
            this.Name = row["Name"].ToString();
            this.Time = (int)row["Time"];
            this.OpeningDay = (DateTime)row["OpeningDay"];
            this.Country = row["Country"].ToString();
            this.Director = row["Director"].ToString();
            this.Genre = (int)row["Genre"];
            this.Description = row["Description"].ToString();
            this.Poster = row["Poster"].ToString();
        }
        public int MId { get; set; }
        public string Name { get; set; }
        public int Time { get; set; }
        public DateTime? OpeningDay { get; set; }
        public string Country { get; set; }
        public string Director { get; set; }
        public int Genre { get; set; }
        public string Description { get; set; }
        public string Poster { get; set; }
    }
}
