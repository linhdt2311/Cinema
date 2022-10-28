using System.Data;
using System;

namespace Cinema.DTO.DtoSeat
{
    public class SeatDto
    {
        public SeatDto(DataRow row)
        {
            ShowtimesId = (Guid)row["ShowtimesId"];
            Name = (int)row["Room"];
            Status = (int)row["Status"];
            SeatId = (Guid)row["SeatId"];
            Seat = (int)row["Seat"];
            Type = (int)row["Type"];
            Price = (int)row["Price"];
            SeatStatus = (int)row["SeatStatus"];
        }
        public Guid ShowtimesId { get; set; }
        public int Name { get; set; }
        public int Status { get; set; }
        public Guid SeatId { get; set; }
        public int Seat { get; set; }
        public int Type { get; set; }
        public int Price { get; set; }
        public int SeatStatus { get; set; }
    }
}
