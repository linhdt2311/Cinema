using System.Data;

namespace Cinema.DTO
{
    public class Room
    {
        public Room(DataRow row)
        {
            this.Name = (int)row["Name"];
        }
        public int Name { get; set; }
    }
}
