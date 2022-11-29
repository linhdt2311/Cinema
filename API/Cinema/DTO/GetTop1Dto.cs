using System.Data;

namespace Cinema.DTO
{
    public class GetTop1Dto
    {
        public GetTop1Dto(DataRow row)
        {
            this.Name = row["Name"].ToString();
            this.Count = (int)row["Count"];
        }
        public string Name { get; set; }
        public int Count { get; set; }
    }
}
