using System;

namespace Cinema.DTO.DtoFood
{
    public class CreateFoodDto
    {
        public Guid CreatorUserId { get; set; }
        public Guid CinemaId { get; set; }
        public string Name { get; set; }
        public int Size { get; set; }
        public int Price { get; set; }
    }
}
