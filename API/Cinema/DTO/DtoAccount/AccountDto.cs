using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Cinema.DTO.DtoAccount
{
    public class AccountDto
    {
        public AccountDto(DataRow row)
        {
            this.Id = (Guid)row["Id"];
            this.Email = row["Email"].ToString();
            this.Role = (int)row["Role"];
            this.Name = row["Name"].ToString();
            this.IdentityCard = row["IdentityCard"].ToString();
            this.DoB = (DateTime)row["DoB"];
            this.Address = row["Address"].ToString();
            this.Phone = row["Phone"].ToString();
            this.Point = (int)row["Point"];
        }
        public Guid Id { get; set; }
        public string Email { get; set; }
        public int Role { get; set; }
        public string Name { get; set; }
        public string IdentityCard { get; set; }
        public DateTime DoB { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public int Point { get; set; }
    }
}
