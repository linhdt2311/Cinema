using System;

namespace Cinema.DTO.DtoShowTimes
{
    public class UpdateShowtimesDto
    {
        public Guid Id { get; set; }
        public Guid LastModifierUserId { get; set; }
        public Guid MovieId { get; set; }
        public DateTime TimeStart { get; set; }
        public int FormatMovieScreen { get; set; }
        public Guid RoomId { get; set; }
    }
}
