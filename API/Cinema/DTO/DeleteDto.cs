using System;

namespace Cinema.DTO
{
    public class DeleteDto
    {
        public Guid Id { get; set; }
        public Guid DeleterUserId { get; set; }
    }
}
