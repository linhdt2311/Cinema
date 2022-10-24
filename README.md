drop database Cinema
create database Cinema
go
use Cinema
go
--Bảng phim
create table Movie(
	MId int identity primary key,
	CreationTime datetime not null,
	CreatorUserId int not null,
	LastModificationTime datetime null,
	LastModifierUserId int  null ,
	IsDeleted bit not null,
	DeleteTime datetime null,
	DeleterUserId int null,
	Name nvarchar(max) not null,
	Time int not null,
	OpeningDay datetime not null,
	Country nvarchar(50),
	Director nvarchar(50),
	Genre int not null,
	Description nvarchar(max) null,
	Poster varchar(max),
)
go
--Bảng lịch chiếu phim
create table Showtimes(
	TId int identity primary key,
	CreationTime datetime not null,
	CreatorUserId int not null,
	LastModificationTime datetime null,
	LastModifierUserId int null ,
	IsDeleted bit not null,
	DeleteTime datetime null,
	DeleterUserId int null,
	MovieId int not null,
	TimeStart datetime not null,
	FormatMovieScreen int not null,
	constraint FK_ShowtimesMovie foreign key (MovieId) references Movie(MId),
)
go
--Bảng phòng chiếu
create table Room(
	RId int identity primary key,
	CreationTime datetime not null,
	CreatorUserId int not null,
	LastModificationTime datetime null,
	LastModifierUserId int null ,
	IsDeleted bit not null,
	DeleteTime datetime null,
	DeleterUserId int null,
	Name int not null,
	ShowtimesId int null,
	Status int not null,
	constraint FK_SeatShowtimes foreign key (ShowtimesId) references Showtimes(TId),
)
go
--Bảng tài khoản để đăng nhập vào hệ thống
create table Account(
	AId int identity primary key,
	CreationTime datetime not null,
	CreatorUserId int not null,
	LastModificationTime datetime null,
	LastModifierUserId int null,
	IsDeleted bit not null,
	DeleteTime datetime null,
	DeleterUserId int null,
	Email nvarchar(50) not null,
	Password nvarchar(30) not null,
	Role int not null,
	Name nvarchar(50) not null,
	IdentityCard varchar(12) null,
	DoB datetime null,
	Address nvarchar(max) null,
	Phone varchar(10) null,
	Point int null,
)
go
--Bảng ghế ngồi trong phòng chiếu
create table Seat(
	SId int identity primary key,
	CreationTime datetime not null,
	CreatorUserId int not null,
	LastModificationTime datetime null,
	LastModifierUserId int null ,
	IsDeleted bit not null,
	DeleteTime datetime null,
	DeleterUserId int null,
	Name int not null,
	RoomId int not null,
	Type int not null,
	Price int not null,
	Status int not null,
	constraint FK_SeatRoom foreign key (RoomId) references Room(RId),
)
go
--Bảng mã khuyến mãi
create table Promotion(
	PId int identity primary key,
	CreationTime datetime not null,
	CreatorUserId int not null,
	LastModificationTime datetime null,
	LastModifierUserId int null ,
	IsDeleted bit not null,
	DeleteTime datetime null,
	DeleterUserId int null,
	Code nvarchar(50) not null,
	Discount int not null,
	StartDay datetime not null,
	EndDay datetime not null,
)
go
--Bảng hóa đơn
create table Bill(
	BId int identity primary key,
	CreationTime datetime not null,
	CreatorUserId int not null,
	LastModificationTime datetime null,
	LastModifierUserId int null ,
	IsDeleted bit not null,
	DeleteTime datetime null,
	DeleterUserId int null,
	AccountId int not null,
	Date datetime not null,
	SeatId int not null,
	Price int not null,
	PromotionId int not null,
	constraint FK_BillAccount foreign key (AccountId) references Account(AId),
	constraint FK_BillSeat foreign key (SeatId) references Seat(SId),
	constraint FK_BillPromotion foreign key (PromotionId) references Promotion(PId),
)
go
--view danh sách các mã khuyến mãi
create view GetAllPromotion
as
	select PId, Code, Discount, StartDay, EndDay from Promotion
go
--proc getall ghế trong 1 phòng
create proc GetAllSeatByRoom
@ShowtimesId int
as
	select r.Name, r.Status, s.sId, s.Name, s.Type, s.Price, s.Status from Room r
	join Seat s on r.rId = s.RoomId
	join Showtimes t on t.TId = r.ShowtimesId
	where t.TId = @ShowtimesId
go
--proc view Movie nếu có tìm kiếm sẽ tìm theo yêu cầu không thì sẽ hiện full
create proc GetViewMovie
@Name nvarchar(max), @Country nvarchar(50), @Genre int, @Director nvarchar(50)
as
	select * from Movie m where m.IsDeleted <> 1 
		and (isnull(@Name, '') = '' or upper(m.Name) like '%' + upper(@Name) + '%')
        and (isnull(@Country, '') = '' or upper(m.Country) like '%' + upper(@Country) + '%')
        and (isnull(@Genre, '') = '' or upper(m.Genre) like '%' + upper(@Genre) + '%')
        and (isnull(@Director, '') = '' or upper(m.Director) like '%' + upper(@Director) + '%')
		order by m.OpeningDay desc
        option (recompile)
go
--proc view Showtimes nếu có tìm kiếm sẽ tìm theo yêu cầu không thì sẽ hiện full
create proc GetViewShowtimes
@MovieId int, @TimeStart datetime, @FormatMovieScreen int
as
	select * from Showtimes t where t.IsDeleted <> 1 
		and (isnull(@MovieId, '') = '' or upper(t.MovieId) like '%' + upper(@MovieId) + '%')
        and (isnull(@TimeStart, '') = '' or upper(t.TimeStart) like '%' + upper(@TimeStart) + '%')
        and (isnull(@FormatMovieScreen, '') = '' or upper(t.FormatMovieScreen) like '%' + upper(@FormatMovieScreen) + '%')
        option (recompile)
go
--proc view Account nếu có tìm kiếm sẽ tìm theo yêu cầu không thì sẽ hiện full
create proc GetViewAccount
@Name nvarchar(50), @Email nvarchar(50), @Password nvarchar(30), @IdentityCard nvarchar(12), @DoB datetime, @Address nvarchar(max), @Phone nvarchar(10), @Point int
as
	select * from Account a where a.IsDeleted <> 1 and a.Role = 1
		and (isnull(@Name, '') = '' or upper(a.Name) like '%' + upper(@Name) + '%')
        and (isnull(@Email, '') = '' or upper(a.Email) like '%' + upper(@Email) + '%')
        and (isnull(@Password, '') = '' or upper(a.Password) like '%' + upper(@Password) + '%')
        and (isnull(@IdentityCard, '') = '' or upper(a.IdentityCard) like '%' + upper(@IdentityCard) + '%')
        and (isnull(@DoB, '') = '' or upper(a.DoB) like '%' + upper(@DoB) + '%')
        and (isnull(@Address, '') = '' or upper(a.Address) like '%' + upper(@Address) + '%')
        and (isnull(@Phone, '') = '' or upper(a.Phone) like '%' + upper(@Phone) + '%')
        and (isnull(@Point, '') = '' or upper(a.Point) like '%' + upper(@Point) + '%')
        option (recompile)
go
--proc view Bill nếu có tìm kiếm sẽ tìm theo yêu cầu không thì sẽ hiện full
create proc GetViewBill
@AccountId int, @Date datetime, @PromotionId int
as
	select * from Bill b where b.IsDeleted <> 1
		and (isnull(@AccountId, '') = '' or upper(b.AccountId) like '%' + upper(@AccountId) + '%')
		and (isnull(@Date, '') = '' or upper(b.Date) like '%' + upper(@Date) + '%')
		and (isnull(@PromotionId, '') = '' or upper(b.PromotionId) like '%' + upper(@PromotionId) + '%')
        option (recompile)
go
--proc add movie
create proc CreateMovie
@CreatorUserId int, @Name nvarchar(max), @Time int, @OpeningDay datetime, @Country nvarchar(50), @Director nvarchar(50), @Genre int, @Description nvarchar(max)
as
	insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values (getdate(), @CreatorUserId, 0, @Name, @Time, @OpeningDay, @Country, @Director, @Genre, @Description)
go
--proc update movie
create proc UpdateMovie
@LastModifierUserId int, @MId int, @Name int, @Time int, @OpeningDay datetime, @Country nvarchar(50), @Director nvarchar(50), @Genre int, @Description nvarchar(max), @Poster nvarchar(max)
as
	update Movie set LastModificationTime = getdate(), LastModifierUserId = @LastModifierUserId, Name = @Name, Time = @Time, OpeningDay = @OpeningDay, Country = @Country, Director = @Director, Genre = @Genre, Description = @Description, Poster = @Poster where MId = @MId
go
--proc delete movie
create proc DeleteMovie
@DeleterUserId int, @MId int
as
	update Movie set IsDeleted = 1, DeleteTime = getdate(), DeleterUserId = @DeleterUserId where MId = @MId
	print 'This movie has been deleted!'
go
--proc update status seat
create proc UpdateSeat
@LastModifierUserId int, @SId int, @Status int
as
	update Seat set LastModificationTime = getdate(), LastModifierUserId = @LastModifierUserId, Status = @Status where SId = @SId
go
--proc add account
create proc CreateAccount
@CreatorUserId int, @Email nvarchar(50), @Password nvarchar(30), @Role int, @Name nvarchar(50), @IdentityCard varchar(12), @DoB datetime, @Address nvarchar(max), @Phone varchar(10)
as
	insert into Account(CreationTime, CreatorUserId, IsDeleted, Email, Password, Role, Name, IdentityCard, DoB, Address, Phone, Point) values (getdate(), @CreatorUserId, 0, @Email, @Password, @Role, @Name, @IdentityCard, @DoB, @Address, @Phone, 0)
go
--proc update account
create proc UpdateAccount
@LastModifierUserId int, @AId int, @Email nvarchar(50), @Password nvarchar(30), @RocreateShowtimesle int, @Name nvarchar(50), @IdentityCard varchar(12), @DoB datetime, @Address nvarchar(max), @Phone varchar(10), @Point int
as
	update Account set LastModificationTime = getdate(), LastModifierUserId = @LastModifierUserId, Email = @Email, Password = @Password, Name = @Name, IdentityCard = @IdentityCard, DoB = @DoB, Address = @Address, Phone = @Phone, Point = @Point where AId = @AId
go
--proc delete account
create proc DeleteAccount
@DeleterUserId int, @AId int
as
	update Account set IsDeleted = 1, DeleteTime = getdate(), DeleterUserId = @DeleterUserId where @AId = @AId
	print 'This account has been deleted!'
go
--proc add showtimes
create proc CreateShowtimes
@CreatorUserId int, @MovieId int, @TimeStart datetime, @FormatMovieScreen int, @RoomName int
as
	insert into Showtimes(CreationTime, CreatorUserId, IsDeleted, MovieId, TimeStart, FormatMovieScreen) values (getdate(), @CreatorUserId, 0, @MovieId, @TimeStart, @FormatMovieScreen)
	insert into Room(CreationTime, CreatorUserId, IsDeleted, Name, Status) values (getdate(), @CreatorUserId, 0, @RoomName, 1)
go
--proc update showtimes
create proc UpdateShowtimes
@LastModifierUserId int, @TId int, @MovieId int, @TimeStart datetime, @FormatMovieScreen int
as
	update Showtimes set LastModificationTime = getdate(), LastModifierUserId = @LastModifierUserId, MovieId = @MovieId, TimeStart = @TimeStart, FormatMovieScreen = @FormatMovieScreen where TId = @TId
go
--proc delete showtimes
create proc DeleteShowtimes
@DeleterUserId int, @TId int
as
	update Showtimes set IsDeleted = 1, DeleteTime = getdate(), DeleterUserId = @DeleterUserId where TId = @TId
	print 'This showtimes has been deleted!'
go
--proc add promotion
create proc CreatePromotion
@CreatorUserId int, @Code nvarchar(50), @Discount int, @StartDay datetime, @EndDay datetime
as
	insert into Promotion(CreationTime, CreatorUserId, IsDeleted, Code, Discount, StartDay, EndDay) values (getdate(), @CreatorUserId, 0, @Code, @Discount, @StartDay, @EndDay)
go
--proc update promotion
create proc UpdatePromotion
@LastModifierUserId int, @PId int, @Code nvarchar(50), @Discount int, @StartDay datetime, @EndDay datetime
as
	update Promotion set LastModificationTime = getdate(), LastModifierUserId = @LastModifierUserId, Code = @Code, Discount = @Discount, StartDay = @StartDay, EndDay = @EndDay where PId = @PId
	select * from GetAllPromotion where PId = @PId
go
--proc delete promotion
create proc DeletePromotion
@DeleterUserId int, @PId int
as
	update Promotion set IsDeleted = 1, DeleteTime = getdate(), DeleterUserId = @DeleterUserId where PId = @PId
	print 'This code has been deleted!'
	select * from GetAllPromotion where PId = @PId
go
--proc add bill
create proc CreateBill
@CreatorUserId int, @AccountId int, @Date datetime, @SeatId int, @Price int, @PromotionId int
as
	insert into Bill(CreationTime, CreatorUserId, IsDeleted, AccountId, Date, SeatId, Price, PromotionId) values (getdate(), @CreatorUserId, 0, @AccountId, @Date, @SeatId, @Price, @PromotionId)
go
--proc update bill
create proc UpdateBill
@LastModifierUserId int, @BId int, @AccountId int, @Date datetime, @SeatId int, @Price int, @PromotionId int
as
	update Bill set LastModificationTime = getdate(), LastModifierUserId = @LastModifierUserId, AccountId = @AccountId, Date = @Date, SeatId = @SeatId, Price = @Price, PromotionId = @PromotionId where PromotionId = @PromotionId
go
--proc delete bill
create proc DeleteBill
@DeleterUserId int, @BId int
as
	update Bill set IsDeleted = 1, DeleteTime = getdate(), DeleterUserId = @DeleterUserId where BId = @BId
	print 'This bill has been deleted!'
go
--trigger add seat in 1 room
create trigger AddSeatInRoom
on Room
for insert
as
	declare @RoomId int = (select RId from Inserted)
	declare @CreatorUserId int = (select CreatorUserId from Inserted)
	declare @i int = 1;
	while @i < 61
	begin
	if((@i > 12 and @i < 19) or (@i > 22 and @i < 29) or (@i > 32 and @i < 39) or (@i > 42 and @i < 49) or (@i > 52 and @i < 59))
		insert into Seat(CreationTime, CreatorUserId, IsDeleted, RoomId, Name, Price, Status, Type) values (GETDATE(), @CreatorUserId, 0, @RoomId, @i, 60000, 1, 1)
	else
		insert into Seat(CreationTime, CreatorUserId, IsDeleted, RoomId, Name, Price, Status, Type) values (GETDATE(), @CreatorUserId, 0, @RoomId, @i, 50000, 1, 2)
	set @i = @i + 1;
	end
	print 'This room has been added with 60 seats.'
go
--trigger chặn ko cho đặt chỗ khi phim đã chiếu
create trigger NoBookTicket
on Seat
for update
as
	if(
	(select t.TimeStart from Showtimes t 
	join Room r on r.ShowtimesId = t.TId 
	join Seat s on s.RoomId = r.RId 
	where s.SId =(select SId from Inserted)) 
	> getdate())
		rollback transaction
		print 'This movie has been showed. You cannot book tickets!!!'
go
--trigger chặn ko cho update khi ghế đã được đặt
create trigger NoUpdateStatusSeat
on Seat
for update
as
	if((select Status from Inserted) = 1)
		rollback transaction
		print 'This seat has been booked. You cannot be selected'
go


select * from Promotion





--danh sách các view
select object_schema_name(v.object_id) schema_name, v.name from sys.views as v;
go
--danh sách các trigger
select name, is_instead_of_trigger from sys.triggers where type = 'TR';
go

--insert tài khoản admin
insert into Account(CreationTime, CreatorUserId, IsDeleted, Email, Password, Role, Name, IdentityCard, DoB, Address, Phone, Point) values ('2022-10-22', 1, 0, 'admin@gmail.com', '123456', 2, N'ad văn min', '001122334455', '2001-01-01', N'Hà Nội', '0123456789', 0)
--insert room
declare @AdminId int = (select AId from (select top 1 * from Account) a)
insert into Room(CreationTime, CreatorUserId, IsDeleted, Name, Status) values ('2022-10-22', @AdminId, 0, 1, 1)
insert into Room(CreationTime, CreatorUserId, IsDeleted, Name, Status) values ('2022-10-22', @AdminId, 0, 2, 1)
insert into Room(CreationTime, CreatorUserId, IsDeleted, Name, Status) values ('2022-10-22', @AdminId, 0, 3, 1)
insert into Room(CreationTime, CreatorUserId, IsDeleted, Name, Status) values ('2022-10-22', @AdminId, 0, 4, 1)
insert into Room(CreationTime, CreatorUserId, IsDeleted, Name, Status) values ('2022-10-22', @AdminId, 0, 5, 1)
insert into Room(CreationTime, CreatorUserId, IsDeleted, Name, Status) values ('2022-10-22', @AdminId, 0, 6, 1)
--insert phim
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Chú khủng long của Nobita', 120, '1980-03-15', 'Japan', 'Hiroshi Fukutomi', 1, N'Truyện phim mở đầu khi Nobita tìm thấy một quả trứng hóa thạch, và bằng bảo bối của Doraemon đã giúp nở ra một chú khủng long hiền lành mà cậu bé đặt tên là Pīsuke. Do không thể nuôi khủng long giữa lòng Tokyo hiện đại, Nobita phải đưa Pīsuke trở về quê nhà ở kỷ Creta, đồng thời tìm cách bảo vệ chú khủng long khỏi sự truy bắt của những tay săn trộm đến từ thế kỷ tương lai.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và lịch sử khai phá vũ trụ', 120, '1981-03-14', 'Japan', 'Hideo Nishimaki', 1, N'Bối cảnh của phim xảy ra luân phiên giữa Trái Đất và Hành tinh Tím qua một cửa không gian thông từ nền phòng Nôbita tới chiếc phi thuyền của những người bạn ở Hành tinh Tím.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita thám hiểm vùng đất mới', 120, '1982-03-13', 'Japan', 'Hideo Nishimaki', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và lâu đài dưới đáy biển', 120, '1983-03-12', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và chuyến phiêu lưu vào xứ quỷ', 120, '1984-03-17', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và cuộc chiến vũ trụ', 120, '1985-03-16', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và binh đoàn người sắt', 120, '1986-03-15', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và hiệp sĩ rồng', 120, '1987-03-14', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita Tây du kí', 120, '1988-03-12', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và nước Nhật thời nguyên thủy', 120, '1989-03-11', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và hành tinh muông thú', 120, '1990-03-10', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita ở xứ sở nghìn lẻ một đêm', 120, '1991-03-09', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và vương quốc trên mây', 120, '1992-03-07', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và mê cung thiếc', 120, '1993-03-06', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và ba chàng hiệp sĩ mộng mơ', 120, '1994-03-12', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Đấng toàn năng Nobita', 120, '1995-03-04', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và chuyến tàu tốc hành Ngân Hà', 120, '1996-03-02', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và cuộc phiêu lưu ở thành phố dây cót', 120, '1997-03-08', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita du hành biển phương Nam', 120, '1998-03-07', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita - Vũ trụ phiêu lưu kí', 120, '1999-03-06', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và truyền thuyết vua Mặt Trời', 120, '2000-03-04', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và những dũng sĩ có cánh', 120, '2001-03-10', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và vương quốc robot', 120, '2002-03-09', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và những pháp sư gió bí ẩn', 120, '2003-03-08', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita ở vương quốc chó mèo', 120, '2004-03-06', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Chú khủng long của Nobita 2006', 120, '2006-03-04', 'Japan', 'Kozo Kusube, Ayumu Watanabe', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và chuyến phiêu lưu vào xứ quỷ', 120, '2007-03-10', 'Japan', 'Yukiyo Teramoto', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và người khổng lồ xanh', 120, '2008-03-08', 'Japan', 'Ayumu Watanabe', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và lịch sử khai phá vũ trụ', 120, '2009-03-07', 'Japan', 'Shigeo Koshi', 1, N'Chuyến phiêu lưu kì thú của Nobita và Doraemon tại hành tinh Koyakoya bắt nguồn từ việc sàn căn phòng Nobita kết nối với một phi thuyền người ngoài hành tinh. Bên cạnh đó cậu và các bạn giúp cư dân hành tinh Koyakoya chống lại âm mưu phá hoại của hành tinh đen.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và cuộc đại thủy chiến ở xứ sở người cá', 120, '2010-03-06', 'Japan', 'Kosuba Kozo', 1, N'Nobita muốn bơi lặn ngay trong thành phố Tokyo. Vì vậy, Doraemon đã sử dụng Máy bơm mô phỏng nguồn nước biển nhân tạo để bơm nước ngập đầy thành phố. Đêm đó Doraemon và Nobita sử dụng kính tạo cảm giác và chân vịt bơi lặn để dạo quanh thành phố toàn nước. Bỗng xuất hiện cá mập đe doạ mọi người và Doraemon buộc phải tắt máy bơm. Nhóm bạn phát hiện một cô bé người cá nằm ngất trong lùm cây tên là Sophia. Sophia là ai? Chuyện gì sẽ xảy ra?')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và binh đoàn người sắt', 120, '2011-03-05', 'Japan', 'Teramoto Yukiyo', 1, N'Với hàm ý "Khi sự dũng mãnh và lòng quyết tâm hòa làm một, sức mạnh thực sự sẽ đến", nội dung phim là cuộc chiến giữa nhóm Doraemon với binh đoàn người sắt âm mưu thôn tính Trái Đất.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và hòn đảo diệu kì - Cuộc phiêu lưu của loài thú', 120, '2012-03-03', 'Japan', 'Kusuba Kozo', 1, N'Kể về chuyến phiêu lưu đến hòn đảo kì bí thời tiền sử và những bí ẩn về con bọ vàng Hercules.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và viện bảo tàng bảo bối', 120, '2013-03-09', 'Japan', 'Teramoto Yukiyo', 1, N'Truyện phim mở đầu với hình ảnh Nobita có mơ ước trở thành thám tử như Sherlock Homes và sau đó đột nhiên Doraemon bị một đạo chích của tương lai mang tên Kaitou Deluxe đánh cắp chiếc chuông. Doraemon và những người bạn đến bảo tàng bảo bối thế kỷ 22 truy tìm hành tung tên trộm.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita thám hiểm vùng đất mới', 120, '2014-03-08', 'Japan', 'Nishimaki Hideo', 1, N'Nội dung truyện phim kể về chuyến thám hiểm của Nobita và những người bạn đến vương quốc loài chó ở khu rừng sương muối châu Phi.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và những hiệp sĩ không gian', 120, '2015-03-07', 'Japan', 'Osugi Yoshihiro', 1, N'Được thực hiện bởi đạo diễn Osugi Yoshihiro kỉ niệm 35 năm phim chủ đề Doraemon nội dung kể về hành trình tìm kiếm người hùng trong bạn của Nobita và những người bạn tại Hành tinh Chuột Pokkuru để chống lại âm mưu xấu xa những tên hải tặc vũ trụ.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và Nước Nhật thời nguyên thủy', 120, '2016-03-05', 'Japan', 'Shibayama Tsutomu', 1, N'Truyện lấy bối cảnh hậu thế Pleistocen tại Nhật Bản và Trung Quốc đại lục có một người xấu xa đến từ thế giới tương lai trở lại quá khứ nhằm thôn tính, thay đổi lịch sử nhân loại. Nobita cùng những người bạn vô tình phiêu lưu đến và giúp bộ tộc cổ đại chống lại Gigazombie.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và chuyến thám hiểm Nam Cực Kachi Kochi', 120, '2017-03-04', 'Japan', 'Takahashi Atsushi', 1, N'Câu chuyện kể về chuyến phiêu lưu của nhóm bạn ở một trăm ngàn năm trước tại Nam Cực để giúp những người bạn từ hành tinh Hyoga Hyoga tiêu diệt Blizzaga - kẻ đã đóng băng hành tinh của họ.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và đảo giấu vàng', 120, '2018-03-03', 'Japan', 'Imai Kazuaki', 1, N'Lấy cảm hứng từ tiểu thuyết Đảo giấu vàng của nhà văn Robert Louis Stevenson. Truyện phim kể về hành trình phiêu lưu truy tìm kho báu trên biển khơi Thái Bình Dương của nhóm bạn. Sau đó, Shizuka bị bắt cóc và những người còn lại cùng nhau đến xào quyệt kẻ bắt cóc giải cứu cô bạn. Nhưng rồi cả nhóm nhanh chóng phát hiện thủ lĩnh nhóm bắt cóc — thuyền trưởng Silver, đang âm mưu hủy diệt địa cầu do điên loạn sau sự ra đi của người vợ mà ông hằng yêu quý. Một lần nữa nhóm chiến đấu bảo vệ địa cầu và thức tỉnh thuyền trưởng Silver.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và Mặt Trăng phiêu lưu ký', 120, '2019-03-01', 'Japan', '	Yakuwa Shinnosuke', 1, N'Nội dung phim kể về chuyến phiêu lưu trên Mặt Trăng của nhóm bạn nhờ vào "Huy hiệu thành viên Câu lạc bộ dị thuyết". Cuộc vui nhanh chóng bị gián đoạn khi Nobita và mọi người biết được rằng Luka mang năng lực đặc biệt đang bị một kẻ xấu tấn công và bắt giữ. Cả nhóm nhanh chóng lên đường giải cứu dù gặp nhiều gian nan, trắc trở.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và những bạn khủng long mới', 120, '2020-08-07', 'Japan', 'Imai Kazuaki', 1, N'Truyện phim kể về việc Nobita tìm thấy một quả trứng khủng long hóa thạch trong buổi triển lãm khủng long và nhờ vào bảo bối của Doraemon mà đã nở ra hai con khủng long, cậu đặt tên chúng là Kyū và Myū. Tuy nhiên, do không thể nuôi chúng trong thế giới hiện đại, Nobita quyết định đưa chúng đến Kỷ Phấn Trắng (66 triệu năm trước).')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và cuộc chiến vũ trụ tí hon 2021', 120, '2022-03-04', 'Japan', 'Yamaguchi Susumu', 1, N'Là bộ phim điện ảnh Nhật Bản thứ 41 trong loạt phim điện ảnh Doraemon do Yamaguchi Susumu đạo diễn và Satō Dai viết kịch bản.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita to Sora no Utopia', 120, '2023-03', 'Japan', 'Doyama Takumi', 1)
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Stand by me Doraemon', 120, '2014-08-08', 'Japan', 'Yamazaki Takashi Yagi Ryūichi', 1, N'Dựa trên nhiều mẩu truyện ngắn khác nhau trong manga Doraemon gốc, tác phẩm được biên tập lại thành phim hoàn chỉnh phát hành nhân dịp kỉ niệm 80 năm ngày sinh cố tác giả Fujiko F. Fujio.Nội dung phim kể về Doraemon, một chú mèo máy không tai đến từ tương lai trở về những năm 70 để giúp một cậu bé "vô tích sự" Nobi Nobita thay đổi tương lai đen tối sang một viễn cảnh tương lai tươi sáng vốn sẽ thay đổi số phận của con cháu Nobita về sau và khi Doraemon hoàn tất nhiệm vụ chia tay Nobita cùng với đó là cuộc hội ngộ bất ngờ của họ do chính Nobita tạo ra.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values ('2022-10-22', @AdminId, 0, N'Stand by me Doraemon 2', 120, '2020-11-20', 'Japan', 'Yamazaki Takashi Yagi Ryūichi', 1, N'Đây là phần phim 3D tiếp nối sau Stand by Me Doraemon phát hành năm 2014, được sản xuất nhằm kỉ niệm 50 năm bộ truyện Doraemon ra đời, chủ yếu lấy cảm hứng từ các chương truyện tranh ngắn do tác giả Fujiko F. Fujio sáng tác và do nhà xuất bản Shogakukan ấn hành, các chương này sau đó từng được chuyển thể thành phim ngắn năm 2000 Kỉ niệm về bà và phim ngắn năm 2002 Ngày tớ ra đời.')
go