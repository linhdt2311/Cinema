using System.Data.SqlClient;

namespace Cinema.Services
{
    public class DBConnect
    {
        public SqlConnection conn = new SqlConnection("Data Source=LINH\\SQL2019;Initial Catalog=Cinema;Integrated Security=True;User ID=sa;pwd=linh123456");
    }
}
