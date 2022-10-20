using System.Data;

namespace Cinema.DTO
{
    public class Room
    {
        public Room(DataRow row)
        {
            this.RId = (int)row["RId"];
            this.RName = (int)row["RName"];
            this.RStatus = (int)row["RStatus"];
        }
        public int RId { get; set; }
        public int RName { get; set; }
        public int RStatus { get; set; }
    }
}
