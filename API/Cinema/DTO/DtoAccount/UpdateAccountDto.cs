using System;

namespace Cinema.DTO.DtoAccount
{
    public class UpdateAccountDto
    {
        public Guid LastModifierUserId { get; set; }
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string IdentityCard { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public DateTime Dob { get; set; }
        public int Role { get; set; }
        public int Point { get; set; }
    }
}
