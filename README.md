--drop database Cinema
create database Cinema
go
use Cinema
go
--Bảng phim
create table Movie(
	Id uniqueidentifier primary key default newid(),
	CreationTime datetime not null,
	CreatorUserId uniqueidentifier not null,
	LastModificationTime datetime null,
	LastModifierUserId uniqueidentifier  null ,
	IsDeleted bit not null,
	DeleteTime datetime null,
	DeleterUserId uniqueidentifier null,
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
--rạp chiếu phim
create table Cinema(
	Id uniqueidentifier primary key default newid(),
	CreationTime datetime not null,
	CreatorUserId uniqueidentifier not null,
	LastModificationTime datetime null,
	LastModifierUserId uniqueidentifier null ,
	IsDeleted bit not null,
	DeleteTime datetime null,
	DeleterUserId uniqueidentifier null,
	Name nvarchar(max),
)
go
--Bảng phòng chiếu
create table Room(
	Id uniqueidentifier primary key default newid(),
	CreationTime datetime not null,
	CreatorUserId uniqueidentifier not null,
	LastModificationTime datetime null,
	LastModifierUserId uniqueidentifier null ,
	IsDeleted bit not null,
	DeleteTime datetime null,
	DeleterUserId uniqueidentifier null,
	Name int not null,
	CinemaId uniqueidentifier not null,
	Status int not null,
	constraint FK_RoomCinema foreign key (CinemaId) references Cinema(Id),
)
go
--Bảng lịch chiếu phim
create table Showtimes(
	Id uniqueidentifier primary key default newid(),
	CreationTime datetime not null,
	CreatorUserId uniqueidentifier not null,
	LastModificationTime datetime null,
	LastModifierUserId uniqueidentifier null ,
	IsDeleted bit not null,
	DeleteTime datetime null,
	DeleterUserId uniqueidentifier null,
	MovieId uniqueidentifier not null,
	TimeStart datetime not null,
	FormatMovieScreen int not null,
	RoomId uniqueidentifier not null,
	constraint FK_ShowtimesMovie foreign key (MovieId) references Movie(Id),
	constraint FK_ShowtimesRoom foreign key (RoomId) references Room(Id),
)
go
--Bảng tài khoản để đăng nhập vào hệ thống
create table Account(
	Id uniqueidentifier primary key default newid(),
	CreationTime datetime not null,
	CreatorUserId uniqueidentifier null,
	LastModificationTime datetime null,
	LastModifierUserId uniqueidentifier null,
	IsDeleted bit not null,
	DeleteTime datetime null,
	DeleterUserId uniqueidentifier null,
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
	Id uniqueidentifier primary key default newid(),
	CreationTime datetime not null,
	CreatorUserId uniqueidentifier not null,
	LastModificationTime datetime null,
	LastModifierUserId uniqueidentifier null ,
	IsDeleted bit not null,
	DeleteTime datetime null,
	DeleterUserId uniqueidentifier null,
	Name int not null,
	ShowtimesId uniqueidentifier not null,
	Type int not null,
	Price int not null,
	Status int not null,
	constraint FK_SeatShowtimes foreign key (ShowtimesId) references Showtimes(Id),
)
go
--Bảng mã khuyến mãi
create table Promotion(
	Id uniqueidentifier primary key default newid(),
	CreationTime datetime not null,
	CreatorUserId uniqueidentifier not null,
	LastModificationTime datetime null,
	LastModifierUserId uniqueidentifier null ,
	IsDeleted bit not null,
	DeleteTime datetime null,
	DeleterUserId uniqueidentifier null,
	Code nvarchar(50) not null,
	Discount int not null,
	StartDate datetime not null,
	EndDate datetime not null,
)
go
--Bảng vé
create table Ticket(
	Id uniqueidentifier primary key default newid(),
	CreationTime datetime not null,
	CreatorUserId uniqueidentifier not null,
	LastModificationTime datetime null,
	LastModifierUserId uniqueidentifier null ,
	IsDeleted bit not null,
	DeleteTime datetime null,
	DeleterUserId uniqueidentifier null,
	AccountId uniqueidentifier not null,
	Date datetime not null,
	SeatId uniqueidentifier not null,
	Price int not null,
	PromotionId uniqueidentifier not null,
	BillId uniqueidentifier null,
	constraint FK_TicketAccount foreign key (AccountId) references Account(Id),
	constraint FK_TicketSeat foreign key (SeatId) references Seat(Id),
	constraint FK_TicketPromotion foreign key (PromotionId) references Promotion(Id),
)
go
--Đồ ăn
create table Food(
	Id uniqueidentifier primary key default newid(),
	CreationTime datetime not null,
	CreatorUserId uniqueidentifier not null,
	LastModificationTime datetime null,
	LastModifierUserId uniqueidentifier null ,
	IsDeleted bit not null,
	DeleteTime datetime null,
	DeleterUserId uniqueidentifier null,
	Name nvarchar(50) not null,
	Size int not null,
	Price int not null,
	CinemaId uniqueidentifier not null,
	constraint FK_FoodCinema foreign key (CinemaId) references Cinema(Id),
)
go
--hóa đơn đồ ăn
create table FoodDetail(
	Id uniqueidentifier primary key default newid(),
	CreationTime datetime not null,
	CreatorUserId uniqueidentifier not null,
	LastModificationTime datetime null,
	LastModifierUserId uniqueidentifier null ,
	IsDeleted bit not null,
	DeleteTime datetime null,
	DeleterUserId uniqueidentifier null,
	FoodId uniqueidentifier not null,
	FoodNum int,
	constraint FK_FoodDetail_Food foreign key (FoodId) references Food(Id),
)
go
--Hóa đơn
create table Bill(
	TicketId uniqueidentifier not null,
	FoodDetailId uniqueidentifier,
	Cost int,
	constraint FK_Bill_FoodDetail foreign key (FoodDetailId) references FoodDetail(Id),
	constraint FK_Bill_Ticket foreign key (TicketId) references Ticket(Id),
)
go
--view danh sách các mã khuyến mãi
create view GetAllPromotion
as
	select Id, Code, Discount, StartDate, EndDate from Promotion where IsDeleted <> 1
go
--proc getall food in cinema
create proc GetAllFoodByCinema
@CinemaId uniqueidentifier
as
	select c.Name as Cinema, f.Name as Food, f.Size, f.Price from Food f
	join Cinema c on c.Id = f.CinemaId
	where c.Id = @CinemaId and f.IsDeleted <> 1
    option (recompile) --Cải thiện hiệu suất xử lý proc
go
--proc getall room in cinema
create proc GetAllRoomByCinema
@CinemaId uniqueidentifier
as
	select r.Id, r.Name as Room, r.Status, c.Name as Cinema from Room r 
	join Cinema c on c.Id = r.CinemaId 
	where c.Id = @CinemaId and r.IsDeleted <> 1
    option (recompile)
go
--proc getall ghế trong 1 phòng 
create proc GetAllSeatByRoom 
@ShowtimesId uniqueidentifier
as
	select t.Id as ShowtimesId, r.Name as Room, r.Status, s.Id as SeatId, s.Name as Seat, s.Type, s.Price, s.Status as SeatStatus from Room r
	join Showtimes t on t.RoomId = r.Id
	join Seat s on t.Id = s.ShowtimesId
	where t.Id = @ShowtimesId order by Seat asc
    option (recompile)
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
@CinemaId uniqueidentifier, @MovieId uniqueidentifier, @TimeStart datetime, @FormatMovieScreen int
as
	if(@CinemaId = '00000000-0000-0000-0000-000000000000' and @MovieId = '00000000-0000-0000-0000-000000000000')
		select * from Showtimes t join Movie m on m.Id = t.MovieId join Room r on r.Id = t.RoomId 
		join Cinema c on c.Id = r.CinemaId where t.IsDeleted <> 1
        and (isnull(@TimeStart, '') = '' or upper(t.TimeStart) like '%' + upper(@TimeStart) + '%')
        and (isnull(@FormatMovieScreen, '') = '' or upper(t.FormatMovieScreen) like '%' + upper(@FormatMovieScreen) + '%')
	else if(@CinemaId = '00000000-0000-0000-0000-000000000000')
		select * from Showtimes t join Movie m on m.Id = t.MovieId join Room r on r.Id = t.RoomId 
		join Cinema c on c.Id = r.CinemaId where t.IsDeleted <> 1 and t.MovieId = @MovieId
        and (isnull(@TimeStart, '') = '' or upper(t.TimeStart) like '%' + upper(@TimeStart) + '%')
        and (isnull(@FormatMovieScreen, '') = '' or upper(t.FormatMovieScreen) like '%' + upper(@FormatMovieScreen) + '%')
		option (recompile)
	else if(@MovieId = '00000000-0000-0000-0000-000000000000')
		select * from Showtimes t join Movie m on m.Id = t.MovieId join Room r on r.Id = t.RoomId 
		join Cinema c on c.Id = r.CinemaId where t.IsDeleted <> 1 and c.Id = @CinemaId
        and (isnull(@TimeStart, '') = '' or upper(t.TimeStart) like '%' + upper(@TimeStart) + '%')
        and (isnull(@FormatMovieScreen, '') = '' or upper(t.FormatMovieScreen) like '%' + upper(@FormatMovieScreen) + '%')
		option (recompile)
	else
		select * from Showtimes t join Movie m on m.Id = t.MovieId join Room r on r.Id = t.RoomId 
		join Cinema c on c.Id = r.CinemaId where t.IsDeleted <> 1 and c.Id = @CinemaId and t.MovieId = @MovieId
        and (isnull(@TimeStart, '') = '' or upper(t.TimeStart) like '%' + upper(@TimeStart) + '%')
        and (isnull(@FormatMovieScreen, '') = '' or upper(t.FormatMovieScreen) like '%' + upper(@FormatMovieScreen) + '%')
		option (recompile)
go
--proc view Account nếu có tìm kiếm sẽ tìm theo yêu cầu không thì sẽ hiện full
create proc GetViewAccount
@Name nvarchar(50), @Email nvarchar(50), @IdentityCard nvarchar(12), @DoB datetime, @Address nvarchar(max), @Phone nvarchar(10)
as
	select * from Account a where a.IsDeleted <> 1 and a.Role = 1
		and (isnull(@Name, '') = '' or upper(a.Name) like '%' + upper(@Name) + '%')
        and (isnull(@Email, '') = '' or upper(a.Email) like '%' + upper(@Email) + '%')
        and (isnull(@IdentityCard, '') = '' or upper(a.IdentityCard) like '%' + upper(@IdentityCard) + '%')
        and (isnull(@DoB, '') = '' or upper(a.DoB) like '%' + upper(@DoB) + '%')
        and (isnull(@Address, '') = '' or upper(a.Address) like '%' + upper(@Address) + '%')
        and (isnull(@Phone, '') = '' or upper(a.Phone) like '%' + upper(@Phone) + '%')
        option (recompile)
go
--proc view Ticket nếu có tìm kiếm sẽ tìm theo yêu cầu không thì sẽ hiện full
create proc GetViewTicket
@AccountId uniqueidentifier, @Date datetime, @PromotionId uniqueidentifier
as
	if(@AccountId = '00000000-0000-0000-0000-000000000000' and @PromotionId = '00000000-0000-0000-0000-000000000000')
		select * from Ticket t where t.IsDeleted <> 1
		and (isnull(@Date, '') = '' or upper(t.Date) like '%' + upper(@Date) + '%')
		option (recompile)
	else if(@AccountId = '00000000-0000-0000-0000-000000000000')
		select * from Ticket t where t.IsDeleted <> 1 and t.AccountId = @AccountId
		and (isnull(@Date, '') = '' or upper(t.Date) like '%' + upper(@Date) + '%')
		option (recompile)
	else if(@PromotionId = '00000000-0000-0000-0000-000000000000')
		select * from Ticket t where t.IsDeleted <> 1 and t.PromotionId = @PromotionId
		and (isnull(@Date, '') = '' or upper(t.Date) like '%' + upper(@Date) + '%')
		option (recompile)
	else
		select * from Ticket t where t.IsDeleted <> 1 and t.PromotionId = @PromotionId and t.AccountId = @AccountId
		and (isnull(@Date, '') = '' or upper(t.Date) like '%' + upper(@Date) + '%')
        option (recompile)
go
--proc add movie
create proc CreateMovie
@CreatorUserId uniqueidentifier, @Name nvarchar(max), @Time int, @OpeningDay datetime, @Country nvarchar(50), @Director nvarchar(50), @Genre int, @Description nvarchar(max)
as
	insert into Movie(CreationTime, CreatorUserId, IsDeleted, Name, Time, OpeningDay, Country, Director, Genre, Description) values (getdate(), @CreatorUserId, 0, @Name, @Time, @OpeningDay, @Country, @Director, @Genre, @Description)
go
--proc update movie
create proc UpdateMovie
@LastModifierUserId uniqueidentifier, @Id uniqueidentifier, @Name int, @Time int, @OpeningDay datetime, @Country nvarchar(50), @Director nvarchar(50), @Genre int, @Description nvarchar(max), @Poster nvarchar(max)
as
	update Movie set LastModificationTime = getdate(), LastModifierUserId = @LastModifierUserId, Name = @Name, Time = @Time, OpeningDay = @OpeningDay, Country = @Country, Director = @Director, Genre = @Genre, Description = @Description, Poster = @Poster where Id = @Id
go
--proc update status seat
create proc UpdateSeat
@LastModifierUserId uniqueidentifier, @Id uniqueidentifier, @Status int
as
	update Seat set LastModificationTime = getdate(), LastModifierUserId = @LastModifierUserId, Status = @Status where Id = @Id
go
--proc add account
create proc CreateAccount
@CreatorUserId uniqueidentifier, @Email nvarchar(50), @Password nvarchar(30), @Role int, @Name nvarchar(50), @IdentityCard varchar(12), @DoB datetime, @Address nvarchar(max), @Phone varchar(10)
as
	insert into Account(CreationTime, CreatorUserId, IsDeleted, Email, Password, Role, Name, IdentityCard, DoB, Address, Phone, Point) values (getdate(), @CreatorUserId, 0, @Email, @Password, @Role, @Name, @IdentityCard, @DoB, @Address, @Phone, 0)
go
--proc update account
create proc UpdateAccount
@LastModifierUserId uniqueidentifier, @Id uniqueidentifier, @Email nvarchar(50), @Password nvarchar(30), @RocreateShowtimesle int, @Name nvarchar(50), @IdentityCard varchar(12), @DoB datetime, @Address nvarchar(max), @Phone varchar(10), @Point int
as
	update Account set LastModificationTime = getdate(), LastModifierUserId = @LastModifierUserId, Email = @Email, Password = @Password, Name = @Name, IdentityCard = @IdentityCard, DoB = @DoB, Address = @Address, Phone = @Phone, Point = @Point where Id = @Id
go
--proc add showtimes
create proc CreateShowtimes
@CreatorUserId uniqueidentifier, @MovieId uniqueidentifier, @TimeStart datetime, @FormatMovieScreen int, @RoomId uniqueidentifier
as
	insert into Showtimes(CreationTime, CreatorUserId, IsDeleted, MovieId, TimeStart, FormatMovieScreen, RoomId) values (getdate(), @CreatorUserId, 0, @MovieId, @TimeStart, @FormatMovieScreen, @RoomId)
go
--proc update showtimes
create proc UpdateShowtimes
@LastModifierUserId uniqueidentifier, @Id uniqueidentifier, @MovieId uniqueidentifier, @TimeStart datetime, @FormatMovieScreen int, @RoomId uniqueidentifier
as
	update Showtimes set LastModificationTime = getdate(), LastModifierUserId = @LastModifierUserId, MovieId = @MovieId, TimeStart = @TimeStart, FormatMovieScreen = @FormatMovieScreen, RoomId = @RoomId where Id = @Id
go
--proc add promotion
create proc CreatePromotion
@CreatorUserId uniqueidentifier, @Code nvarchar(50), @Discount int, @StartDate datetime, @EndDate datetime
as
	insert into Promotion(CreationTime, CreatorUserId, IsDeleted, Code, Discount, StartDate, EndDate) values (getdate(), @CreatorUserId, 0, @Code, @Discount, @StartDate, @EndDate)
go
--proc update promotion
create proc UpdatePromotion
@LastModifierUserId uniqueidentifier, @Id uniqueidentifier, @Code nvarchar(50), @Discount int, @StartDate datetime, @EndDate datetime
as
	update Promotion set LastModificationTime = getdate(), LastModifierUserId = @LastModifierUserId, Code = @Code, Discount = @Discount, StartDate = @StartDate, EndDate = @EndDate where Id = @Id
	select * from GetAllPromotion where Id = @Id
go
--proc add Ticket
create proc CreateTicket
@CreatorUserId uniqueidentifier, @AccountId uniqueidentifier, @Date datetime, @SeatId uniqueidentifier, @Price int, @PromotionId uniqueidentifier
as
	insert into Ticket(CreationTime, CreatorUserId, IsDeleted, AccountId, Date, SeatId, Price, PromotionId) values (getdate(), @CreatorUserId, 0, @AccountId, @Date, @SeatId, @Price, @PromotionId)
go
--proc update Ticket
create proc UpdateTicket
@LastModifierUserId uniqueidentifier, @Id uniqueidentifier, @AccountId uniqueidentifier, @Date datetime, @SeatId uniqueidentifier, @Price int, @PromotionId uniqueidentifier
as
	update Ticket set LastModificationTime = getdate(), LastModifierUserId = @LastModifierUserId, AccountId = @AccountId, Date = @Date, SeatId = @SeatId, Price = @Price, PromotionId = @PromotionId where Id = @Id
go
--proc add Food
create proc CreateFood
@CreatorUserId uniqueidentifier, @CinemaId uniqueidentifier, @Name nvarchar(30), @Size int, @Price int
as
	insert into Food(CreationTime, CreatorUserId, IsDeleted, CinemaId, Name, Size, Price) values (getdate(), @CreatorUserId, 0, @CinemaId, @Name, @Size, @Price)
go
--proc update Food
create proc UpdateFood
@LastModifierUserId uniqueidentifier, @Id uniqueidentifier, @CinemaId uniqueidentifier, @Name nvarchar(30), @Size int, @Price int
as
	update Food set LastModificationTime = getdate(), LastModifierUserId = @LastModifierUserId, CinemaId = @CinemaId, Name = @Name, Size = @Size, Price = @Price where Id = @Id
go
--proc add FoodDetail
create proc CreateFoodDetail
@CreatorUserId uniqueidentifier, @FoodId uniqueidentifier, @FoodNum int
as
	insert into FoodDetail(CreationTime, CreatorUserId, IsDeleted, FoodId, FoodNum) values (getdate(), @CreatorUserId, 0, @FoodId, @FoodNum)
go
--proc update FoodDetail
create proc UpdateFoodDetail
@LastModifierUserId uniqueidentifier, @Id uniqueidentifier, @FoodId uniqueidentifier, @FoodNum int
as
	update FoodDetail set LastModificationTime = getdate(), LastModifierUserId = @LastModifierUserId, FoodId = @FoodId, FoodNum = @FoodNum where Id = @Id
go
--proc login
create proc Login
@Email nvarchar(50), @Password nvarchar(30)
as
	select * from Account where Email = @Email and Password = @Password
	if(@@rowcount = 1)
		print 'Login success!'
	else
		print 'Login fail -_-'
go
--proc add poster
create proc AddPosterMovie
@Url nvarchar(max), @MovieId uniqueidentifier
as
	begin
	insert into Poster(Url, MovieId) values (@Url, @MovieId)
	select MovieId, IsMain from Poster where IsMain = 1 group by MovieId, IsMain
	if(@@rowcount = 0)
		update Poster set IsMain = 1 where MovieId = @MovieId and Url = @Url
	else
		update Poster set IsMain = 0 where MovieId = @MovieId and Url = @Url
	end
go
--trigger add seat in 1 room
create trigger AddSeatInRoom
on Showtimes
for insert
as
	declare @ShowtimesId uniqueidentifier = (select Id from Inserted)
	declare @CreatorUserId uniqueidentifier = (select CreatorUserId from Inserted)
	declare @i int = 1;
	while @i < 65
	begin
	if((@i > 18 and @i < 23) or (@i > 26 and @i < 31) or (@i > 34 and @i < 39) or (@i > 42 and @i < 47))
		insert into Seat(CreationTime, CreatorUserId, IsDeleted, Name, Price, Status, Type, ShowtimesId) values (GETDATE(), @CreatorUserId, 0, @i, 60000, 1, 1, @ShowtimesId)
	else
		insert into Seat(CreationTime, CreatorUserId, IsDeleted, Name, Price, Status, Type, ShowtimesId) values (GETDATE(), @CreatorUserId, 0, @i, 50000, 1, 2, @ShowtimesId)
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
	join Seat s on s.ShowtimesId = t.Id 
	join Room r on r.Id = t.RoomId
	where s.Id =(select Id from Inserted)) 
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








--danh sách các view
select object_schema_name(v.object_id) schema_name, v.name from sys.views as v;
go
--danh sách các trigger
select name, is_instead_of_trigger from sys.triggers where type = 'TR';
go

--insert tài khoản admin
insert into Account(CreationTime, IsDeleted, Email, Password, Role, Name, IdentityCard, DoB, Address, Phone, Point) values ('2022-10-22', 0, 'admin@gmail.com', '123456', 2, N'ad văn min', '001122334455', '2001-01-01', N'Hà Nội', '0123456789', 0)
declare @AdminId uniqueidentifier = (select Id from (select top 1 * from Account) a)
--insert Cinema
insert into Cinema(CreationTime, CreatorUserId, IsDeleted, Name) values ('2022-10-22', @AdminId, 0, N'CGV')
insert into Cinema(CreationTime, CreatorUserId, IsDeleted, Name) values ('2022-10-22', @AdminId, 0, N'Beta')
insert into Cinema(CreationTime, CreatorUserId, IsDeleted, Name) values ('2022-10-22', @AdminId, 0, N'BHD')
insert into Cinema(CreationTime, CreatorUserId, IsDeleted, Name) values ('2022-10-22', @AdminId, 0, N'Lotte')
--insert room
declare @j int = 1;
while @j < 5
begin
	declare @CinemaId uniqueidentifier = (select Id from (select row_number() over(order by Name asc) as row, * from Cinema) c where row = @j)
	insert into Food(CreationTime, CreatorUserId, IsDeleted, Name, Size, Price, CinemaId) values ('2022-10-22', @AdminId, 0, N'Bỏng ngô Default', 1, 25000, @CinemaId)
	insert into Food(CreationTime, CreatorUserId, IsDeleted, Name, Size, Price, CinemaId) values ('2022-10-22', @AdminId, 0, N'Bỏng ngô Default', 2, 30000, @CinemaId)
	insert into Food(CreationTime, CreatorUserId, IsDeleted, Name, Size, Price, CinemaId) values ('2022-10-22', @AdminId, 0, N'Bỏng ngô Default', 3, 35000, @CinemaId)
	insert into Food(CreationTime, CreatorUserId, IsDeleted, Name, Size, Price, CinemaId) values ('2022-10-22', @AdminId, 0, N'Bỏng ngô Caramel', 1, 30000, @CinemaId)
	insert into Food(CreationTime, CreatorUserId, IsDeleted, Name, Size, Price, CinemaId) values ('2022-10-22', @AdminId, 0, N'Bỏng ngô Caramel', 2, 35000, @CinemaId)
	insert into Food(CreationTime, CreatorUserId, IsDeleted, Name, Size, Price, CinemaId) values ('2022-10-22', @AdminId, 0, N'Bỏng ngô Caramel', 3, 40000, @CinemaId)
	insert into Food(CreationTime, CreatorUserId, IsDeleted, Name, Size, Price, CinemaId) values ('2022-10-22', @AdminId, 0, N'Bỏng ngô Phomai', 1, 30000, @CinemaId)		
	insert into Food(CreationTime, CreatorUserId, IsDeleted, Name, Size, Price, CinemaId) values ('2022-10-22', @AdminId, 0, N'Bỏng ngô Phomai', 2, 35000, @CinemaId)
	insert into Food(CreationTime, CreatorUserId, IsDeleted, Name, Size, Price, CinemaId) values ('2022-10-22', @AdminId, 0, N'Bỏng ngô Phomai', 3, 40000, @CinemaId)
	insert into Food(CreationTime, CreatorUserId, IsDeleted, Name, Size, Price, CinemaId) values ('2022-10-22', @AdminId, 0, N'Nước Coca', 1, 30000, @CinemaId)
	insert into Food(CreationTime, CreatorUserId, IsDeleted, Name, Size, Price, CinemaId) values ('2022-10-22', @AdminId, 0, N'Nước Coca', 2, 35000, @CinemaId)
	insert into Food(CreationTime, CreatorUserId, IsDeleted, Name, Size, Price, CinemaId) values ('2022-10-22', @AdminId, 0, N'Nước Coca', 3, 40000, @CinemaId)
	declare @i int = 1;
	while @i < 7
	begin
		insert into Room(CreationTime, CreatorUserId, IsDeleted, Name, Status, CinemaId) values ('2022-10-22', @AdminId, 0, @i, 1, @CinemaId)
	set @i = @i + 1;
	end
	set @j = @j + 1;
end
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
--insert showtimes
declare @AId uniqueidentifier = (select Id from (select top 1 * from Account) a)
declare @n int = 1;
while @n < 41
begin
	declare @MovieId uniqueidentifier = (select Id from (select row_number() over(order by Name asc) as row, * from Movie) m where row = @n)
	declare @m int = 1;
	while @m < 7
	begin
		declare @RoomId uniqueidentifier = (select Id from (select row_number() over(order by Name asc) as row, * from Room) r where row = @m)
		insert into Showtimes(CreationTime, CreatorUserId, IsDeleted, MovieId, TimeStart, FormatMovieScreen, RoomId) values ('2022-10-22', @AId, 0, @MovieId, '2022-10-29 01:00:00', 2, @RoomId)
		insert into Showtimes(CreationTime, CreatorUserId, IsDeleted, MovieId, TimeStart, FormatMovieScreen, RoomId) values ('2022-10-22', @AId, 0, @MovieId, '2022-10-29 04:00:00', 2, @RoomId)
		insert into Showtimes(CreationTime, CreatorUserId, IsDeleted, MovieId, TimeStart, FormatMovieScreen, RoomId) values ('2022-10-22', @AId, 0, @MovieId, '2022-10-29 09:00:00', 2, @RoomId)
		insert into Showtimes(CreationTime, CreatorUserId, IsDeleted, MovieId, TimeStart, FormatMovieScreen, RoomId) values ('2022-10-22', @AId, 0, @MovieId, '2022-10-29 12:00:00', 2, @RoomId)
		insert into Showtimes(CreationTime, CreatorUserId, IsDeleted, MovieId, TimeStart, FormatMovieScreen, RoomId) values ('2022-10-22', @AId, 0, @MovieId, '2022-10-29 15:00:00', 2, @RoomId)
	set @m = @m + 1;
	end
	set @n = @n + 1;
end
go