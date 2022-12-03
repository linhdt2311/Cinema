using Cinema.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System;
using Cinema.DTO.DtoAccount;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Cinema.DTO;

namespace Cinema.Controllers
{
    [ApiController]
    [Route("api/account")]
    public class AccountController : DBConnect
    {
        [HttpGet("getall")]
        [AllowAnonymous]
        public List<AccountDto> GetAllAccountDto(string name, string email, string identityCard, DateTime? dob, string address, string phone)
        {
            conn.Open();
            string sql = string.Format("exec GetViewAccount @Name = '" + name + "',@Email = '" + email + "', @IdentityCard = '" + identityCard + "', @DoB = '" + dob + "', @Address = '" + address + "', @Phone = '" + phone + "'");

            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            DataTable data = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(sqlCommand);
            adapter.Fill(data);
            var accountList = new List<AccountDto>();
            foreach (DataRow i in data.Rows)
            {
                AccountDto account = new AccountDto(i);
                accountList.Add(account);
            }
            conn.Close();
            return accountList.ToList();
        }
        [HttpGet("gettopcustomer")]
        public List<GetTop1Dto> GetTopCustomer()
        {
            conn.Open();
            string sql = string.Format("select top 10 a.Name, sum(b.Cost) as Count from Account a join Bill b on a.Id = b.AccountId group by a.Name order by Count desc");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            DataTable data = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(sqlCommand);
            adapter.Fill(data);
            var list = new List<GetTop1Dto>();
            foreach (DataRow i in data.Rows)
            {
                GetTop1Dto account = new GetTop1Dto(i);
                list.Add(account);
            }
            conn.Close();
            return list.ToList();
        }
        [HttpPost("create")]
        public bool CreateAccount(CreateAccountDto input)
        {
            conn.Open();
            string sql = string.Format("exec CreateAccount @Email = '" + input.Email + "', @Password = '" + input.Password + "', @Role = '" + input.Role + "', @Name = N'" + input.Name + "', @IdentityCard = '" + input.IdentityCard + "', @DoB = '" + input.Dob.ToString("yyyy-MM-dd") + "', @Address = N'" + input.Address + "', @Phone = '" + input.Phone + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpPut("update")]
        public bool UpdateAccount(UpdateAccountDto input)
        {
            conn.Open();
            string sql = string.Format("exec UpdateAccount @LastModifierUserId = '" + input.LastModifierUserId + "', @Id = '" + input.Id + "', @Email = '" + input.Email + "', @Password = '" + input.Password + "', @Role = '" + input.Role + "', @Name = N'" + input.Name + "', @IdentityCard = '" + input.IdentityCard + "', @DoB = '" + input.Dob.ToString("yyyy-MM-dd") + "', @Address = N'" + input.Address + "', @Phone = '" + input.Phone + "', @Point = '" + input.Point + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpDelete("delete")]
        public bool DeleteAccount(DeleteDto input)
        {
            conn.Open();
            string sql = string.Format("update Account set IsDeleted = 1, DeleteTime = getdate(), DeleterUserId = '" + input.DeleterUserId + "' where Id = '" + input.Id + "'");

            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpPost("login")]
        public AccountDto Login(LoginDto input)
        {
            conn.Open();
            string sql = string.Format("exec Login @Email = '" + input.Email + "', @Password = '" + input.Password + "'");

            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            DataTable data = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(sqlCommand);
            adapter.Fill(data);
            conn.Close();
            return new AccountDto(data.Rows[0]);
        }
    }
}
