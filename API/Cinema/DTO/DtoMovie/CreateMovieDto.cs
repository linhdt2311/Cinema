﻿using System;

namespace Cinema.DTO.DtoMovie
{
    public class CreateMovieDto
    {
        public Guid CreatorUserId { get; set; }
        public string Name { get; set; }
        public int Time { get; set; }
        public DateTime OpeningDay { get; set; }
        public string Country { get; set; }
        public string Director { get; set; }
        public string Description { get; set; }
        public string Poster { get; set; }
    }
}
