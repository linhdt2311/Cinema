using System;

namespace Cinema.DTO.DtoShowTimes
{
    public class CreateShowtimesDto
    {
        public Guid CreatorUserId { get; set; }
        public Guid MovieId { get; set; }
        public DateTime TimeStart { get; set; }
        public Guid RoomId { get; set; }
    }
}
