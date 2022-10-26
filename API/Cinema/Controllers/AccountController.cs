using Cinema.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System;
using Cinema.DTO.DtoAccount;
using System.Linq;
using Cinema.Enum;
using System.IO;
using System.Xml.Linq;
using Microsoft.AspNetCore.Authorization;

namespace Cinema.Controllers
{
    [ApiController]
    [Route("api/account")]
    public class AccountController : DBConnect
    {
        [HttpGet("getall")]
        [AllowAnonymous]
        public List<AccountDto> GetAllAccountDto(string name, string email, string password, string identityCard, DateTime? dob, string address, string phone, int? point)
        {
            conn.Open();
            string sql = string.Format("exec GetViewAccount @Name = '" + name + "',@Email = '" + email + "', @Password = '" + password + "', @IdentityCard = '" + identityCard + "', @DoB = '" + dob + "', @Address = '" + address + "', @Phone = '" + phone + "', @Point = '" + point + "'");

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
        [HttpPost("create")]
        public bool CreateAccount(int creatorUserId, string email, string password, int role, string name, string identityCard, DateTime dob, string address, string phone)
        {
            conn.Open();
            string sql = string.Format("exec CreateAccount @CreatorUserId = " + creatorUserId + ", @Email = '" + email + "', @Password = '" + password + "', @Role = " + role + ", @Name = '" + name + "', @IdentityCard = '" + identityCard + "', @DoB = '" + dob + "', @Address = '" + address + "', @Phone = '" + phone + "'");
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpPut("update")]
        public bool UpdateAccount(int lastModifierUserId, int aId, string email, string password, int role, string name, string identityCard, DateTime dob, string address, string phone, int point)
        {
            conn.Open();
            string sql = string.Format("exec UpdateAccount @LastModifierUserId = " + lastModifierUserId + ", @AId = " + aId + ", @Email = '" + email + "', @Password = '" + password + "', @Role = " + role + ", @Name = '" + name + "', @IdentityCard = '" + identityCard + "', @DoB = '" + dob + "', @Address = '" + address, "', @Phone = '" + phone + "', @Point = " + point);
            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
        [HttpDelete("delete")]
        public bool DeleteAccount(int deleterUserId, int aId)
        {
            conn.Open();
            string sql = string.Format("exec DeletePromotion @DeleterUserId = " + deleterUserId + ", @AId = " + aId);

            SqlCommand sqlCommand = new SqlCommand(sql, conn);
            if (sqlCommand.ExecuteNonQuery() > 0) return true;
            conn.Close();
            return false;
        }
    }
}
