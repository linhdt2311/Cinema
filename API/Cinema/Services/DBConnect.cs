﻿using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace Cinema.Services
{
    public class DBConnect : ControllerBase
    {
        public SqlConnection conn = new SqlConnection("Data Source=LINH\\SQL2019;Initial Catalog=Cinema;Integrated Security=True;User ID=sa;pwd=linh123456");
        //public SqlConnection conn = new SqlConnection("Data Source=DESKTOP-SI1SCKG;Initial Catalog=Cinema;Integrated Security=True;User ID=sa;pwd=456789asd");
        //public SqlConnection conn = new SqlConnection("Data Source=LAPTOP-QLBBEOAM;Initial Catalog=Cinema;Integrated Security=True;User ID=sa;pwd=456789asd");
        //public SqlConnection conn = new SqlConnection("Data Source=DESKTOP-SI1SCKG;Initial Catalog=CinemaPhu;Integrated Security=True;User ID=sa;pwd=456789asd");
    }
}
