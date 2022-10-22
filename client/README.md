drop database Cinema
create database Cinema
go
use Cinema
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
	RName int not null,
	RStatus int not null,
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
	SName int not null,
	RId int not null,
	SType int not null,
	SPrice int not null,
	SStatus int not null,
	constraint FK_SeatInRoom foreign key (RId) references Room(RId),
)
go
--Bảng tài khoản để đăng nhập vào hệ thống
create table Account(
	AId int identity primary key,
	CreationTime datetime not null,
	CreatorUserId int not null,
	LastModificationTime datetime null,
	LastModifierUserId int null ,
	IsDeleted bit not null,
	DeleteTime datetime null,
	DeleterUserId int null,
	AEmail nvarchar(50) not null,
	APassword nvarchar(30) not null,
	ARole int not null,
	AName nvarchar(50) not null,
	AIdentityCard varchar(12) null,
	ADoB datetime null,
	AAddress nvarchar(max) null,
	APhone varchar(10) null,
	APoint int null,
)
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
	MName nvarchar(max) not null,
	MTime int not null,
	MOpeningDay datetime not null,
	MCountry nvarchar(50),
	MDirector nvarchar(50),
	MGenre int not null,
	MDescription nvarchar(max) null,
	MPoster varchar(max),
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
	MId int not null,
	RId int not null,
	TTime datetime not null,
	TFormatMovieScreen int not null,
	constraint FK_ShowtimesMovie foreign key (MId) references Movie(MId),
	constraint FK_ShowtimesRoom foreign key (RId) references Room(RId),
)
go
--Bảng mã khuyến mãi
create table Code(
	CodeId int identity primary key,
	CreationTime datetime not null,
	CreatorUserId int not null,
	LastModificationTime datetime null,
	LastModifierUserId int null ,
	IsDeleted bit not null,
	DeleteTime datetime null,
	DeleterUserId int null,
	CodeName nvarchar(50) not null,
	CodeDiscount int not null,
	CodeStart datetime not null,
	CodeEnd datetime not null,
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
	AId int not null,
	BDate datetime not null,
	TId int not null,
	SId int not null,
	BPrice int not null,
	CodeId int not null,
	constraint FK_CustomerName foreign key (AId) references Account(AId),
	constraint FK_Showtimes foreign key (TId) references Showtimes(TId),
	constraint FK_SeatOfCustomer foreign key (SId) references Seat(SId),
	constraint FK_Discount foreign key (CodeId) references Code(CodeId),
)
go
--view danh sách các phòng chiếu
create view GetAllRoom 
as
	select RId, RName, RStatus from Room
go
-- get all moi
create proc GetViewRoom
@RName nvarchar(50), @RStatus nvarchar(50)
as
select * from Room VHC where VHC.IsDeleted <> 1 
                    AND (ISNULL(RName, '') = '' OR UPPER(VHC.RName) like  '%' + UPPER(RName) + '%')
                    AND (ISNULL(@RStatus, '') = '' OR UPPER(VHC.RStatus) like '%' + UPPER(@RStatus)  + '%')
                    OPTION (RECOMPILE)
					go
--view danh sách các lịch chiếu phim
create view GetAllShowtimes
as
	select TId, MId, RId, TTime, TFormatMovieScreen from Showtimes order by TTime desc
go
-- get all moi
create proc GetViewShowTime
@MId int, @RId int , @TTime datetime
as
select * from Showtimes VHC where VHC.IsDeleted <> 1 
                    AND (ISNULL(@MId, '') = '' OR UPPER(VHC.MId) like  '%' + UPPER(@MId) + '%')
                    AND (ISNULL(@RId, '') = '' OR UPPER(VHC.RId) like '%' + UPPER(@RId)  + '%')
                    AND (ISNULL(@TTime, '') = '' OR VHC.TTime like '%' + @TTime  + '%')
                    OPTION (RECOMPILE)
					go
--view danh sách các phim
create view GetAllMovie
as
	select MId, MName, MGenre, MTime, MOpeningDay, MCountry, MDirector, MPoster, MDescription from Movie
go
-- get all moi
create proc GetViewMovie
@MName nvarchar(MAX), @MCountry nvarchar(50)
as
select * from Movie VHC where VHC.IsDeleted <> 1 
                    AND (ISNULL(@MName, '') = '' OR UPPER(VHC.MName) like  '%' + UPPER(@MName) + '%')
                    AND (ISNULL(@MCountry, '') = '' OR UPPER(VHC.MCountry) like '%' + UPPER(@MCountry)  + '%')
                    OPTION (RECOMPILE)
					go
--view danh sách các mã khuyến mãi
create view GetAllCode
as
	select CodeId, CodeName, CodeDiscount, CodeStart, CodeEnd from Code
go
--view danh sách các tài khoản khách hàng
create view GetAllAccount
as
	select AId, AEmail, APassword, AName, AAddress, APhone, AIdentityCard, ADoB, APoint from Account where ARole = 1 order by CreationTime desc
go
--view danh sách ghế
create view GetAllSeat
as
	select SId, SName, RId, SType, SPrice, SStatus from Seat order by SName asc
go
--view danh sách các hóa đơn
create view GetAllBill
as
	select BId, AId, TId, SId, BDate, BPrice, CodeId from Bill order by BDate desc
go
--proc getall ghế trong 1 phòng
create proc GetAllSeatByRoom
@RoomId int
as
	select r.rId, r.rName, r.rStatus, s.sId, s.sName, s.sType, s.sPrice, s.sStatus from Room r
	join Seat s on r.rId = s.rId
	where r.RId = @RoomId
go
--proc add room
create proc CreateRoom
@CreatorUserId int, @RName int
as
	insert into Room(CreationTime, CreatorUserId, IsDeleted, RName, RStatus) values (getdate(), @CreatorUserId, 0, @RName, 1)
go
--proc update room
create proc UpdateRoom
@LastModifierUserId int, @RId int, @RName int, @RStatus int
as
	update Room set LastModificationTime = getdate(), LastModifierUserId = @LastModifierUserId, RName = @RName, RStatus = @RStatus where RId = @RId
	select * from GetAllRoom where RId = @RId
go
--proc delete room
create proc DeleteRoom
@DeleterUserId int, @RId int
as
	update Seat set IsDeleted = 1, DeleteTime = getdate(), DeleterUserId = @DeleterUserId where RId = @RId
	update Room set IsDeleted = 1, DeleteTime = getdate(), DeleterUserId = @DeleterUserId where RId = @RId
	print 'This room has been deleted!'
	select * from Room where RId = @RId
go
--trigger add seat in 1 room
create trigger AddSeatInRoom
on Room
for insert
as
	select * from GetAllRoom where RId = (select RId from Inserted)
	declare @RoomId int = (select RId from Inserted)
	declare @CreatorUserId int = (select CreatorUserId from Inserted)
	declare @i int = 1;
	while @i < 61 
	begin
		insert into Seat(CreationTime, CreatorUserId, IsDeleted, RId, SName, SPrice, SStatus, SType) values (getdate(), @CreatorUserId, 0, @RoomId, @i, 50000, 1, 1)
	set @i = @i + 1;
	end
	print 'This room has been added with 60 seats.'
go
--proc add movie
create proc CreateMovie
@CreatorUserId int, @MName int, @MTime int, @MOpeningDay datetime, @MCountry nvarchar(50), @MDirector nvarchar(50), @MGenre int, @MDescription nvarchar(max)
as
	insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values (getdate(), @CreatorUserId, 0, @MName, @MTime, @MOpeningDay, @MCountry, @MDirector, @MGenre, @MDescription)
go
--proc update movie
create proc UpdateMovie
@LastModifierUserId int, @MId int, @MName int, @MTime int, @MOpeningDay datetime, @MCountry nvarchar(50), @MDirector nvarchar(50), @MGenre int, @MDescription nvarchar(max)
as
	update Movie set LastModificationTime = getdate(), LastModifierUserId = @LastModifierUserId, MName = @MName, MTime = @MTime, MOpeningDay = @MOpeningDay, MCountry = @MCountry, MDirector = @MDirector, MGenre = @MGenre, MDescription = @MDescription where MId = @MId
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
@LastModifierUserId int, @SId int, @SStatus int
as
	update Seat set LastModificationTime = getdate(), LastModifierUserId = @LastModifierUserId, SStatus = @SStatus where SId = @SId
	select * from GetAllSeat where SId = @SId
go
--proc add account
create proc CreateAccount
@CreatorUserId int, @AEmail nvarchar(50), @APassword nvarchar(30), @ARole int, @AName nvarchar(50), @AIdentityCard varchar(12), @ADoB datetime, @AAddress nvarchar(max), @APhone varchar(10)
as
	insert into Account(CreationTime, CreatorUserId, IsDeleted, AEmail, APassword, ARole, AName, AIdentityCard, ADoB, AAddress, APhone, APoint) values (getdate(), @CreatorUserId, 0, @AEmail, @APassword, @ARole, @AName, @AIdentityCard, @ADoB, @AAddress, @APhone, 0)
go
--proc update account
create proc UpdateAccount
@LastModifierUserId int, @AId int, @AEmail nvarchar(50), @APassword nvarchar(30), @ARole int, @AName nvarchar(50), @AIdentityCard varchar(12), @ADoB datetime, @AAddress nvarchar(max), @APhone varchar(10), @APoint int
as
	update Account set LastModificationTime = getdate(), LastModifierUserId = @LastModifierUserId, AEmail = @AEmail, APassword = @APassword, AName = @AName, AIdentityCard = @AIdentityCard, ADoB = @ADoB, AAddress = @AAddress, APhone = @APhone, APoint = @APoint where AId = @AId
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
@CreatorUserId int, @MId int, @RId int, @TTimme datetime, @TFormatMovieScreen int
as
	insert into Showtimes(CreationTime, CreatorUserId, IsDeleted, MId, RId, TTime, TFormatMovieScreen) values (getdate(), @CreatorUserId, 0, @MId, @RId, @TTimme, @TFormatMovieScreen)
go
--proc update showtimes
create proc UpdateShowtimes
@LastModifierUserId int, @TId int, @MId int, @RId int, @TTime datetime, @TFormatMovieScreen int
as
	update Showtimes set LastModificationTime = getdate(), LastModifierUserId = @LastModifierUserId, MId = @MId, RId = @RId, TTime = @TTime, TFormatMovieScreen = @TFormatMovieScreen where TId = @TId
go
--proc delete showtimes
create proc DeleteShowtimes
@DeleterUserId int, @TId int
as
	update Showtimes set IsDeleted = 1, DeleteTime = getdate(), DeleterUserId = @DeleterUserId where TId = @TId
go
--proc add code
create proc CreateCode
@CreatorUserId int, @CodeName nvarchar(50), @CodeDiscount int, @CodeStart datetime, @CodeEnd datetime
as
	insert into Code(CreationTime, CreatorUserId, IsDeleted, CodeName, CodeDiscount, CodeStart, CodeEnd) values (getdate(), @CreatorUserId, 0, @CodeName, @CodeDiscount, @CodeStart, @CodeEnd)
go
--proc update code
create proc UpdateCode
@LastModifierUserId int, @CodeId int, @CodeName nvarchar(50), @CodeDiscount int, @CodeStart datetime, @CodeEnd datetime
as
	update Code set LastModificationTime = getdate(), LastModifierUserId = @LastModifierUserId, CodeName = @CodeName, CodeDiscount = @CodeDiscount, CodeStart = @CodeStart, CodeEnd = @CodeEnd where CodeId = @CodeId
go
--proc delete code
create proc DeleteCode
@DeleterUserId int, @CodeId int
as
	update Code set IsDeleted = 1, DeleteTime = getdate(), DeleterUserId = @DeleterUserId where CodeId = @CodeId
	print 'This code has been deleted!'
go
--proc add bill
create proc CreateBill
@CreatorUserId int, @AId int, @BDate datetime, @TId int, @SId int, @BPrice int, @CodeId int
as
	insert into Bill(CreationTime, CreatorUserId, IsDeleted, AId, BDate, TId, SId, BPrice, CodeId) values (getdate(), @CreatorUserId, 0, @AId, @BDate, @TId, @SId, @BPrice, @CodeId)
go
--proc update bill
create proc UpdateBill
@LastModifierUserId int, @BId int, @AId int, @BDate datetime, @TId int, @SId int, @BPrice int, @CodeId int
as
	update Bill set LastModificationTime = getdate(), LastModifierUserId = @LastModifierUserId, AId = @AId, BDate = @BDate, TId = @TId, SId = @SId, BPrice = @BPrice, CodeId = @CodeId where CodeId = @CodeId
	select * from GetAllBill where BId = @BId
go
--proc delete bill
create proc DeleteBill
@DeleterUserId int, @BId int
as
	update Bill set IsDeleted = 1, DeleteTime = getdate(), DeleterUserId = @DeleterUserId where BId = @BId
	print 'This bill has been deleted!'
	select * from GetAllBill where BId = @BId
go









--danh sách các view
select object_schema_name(v.object_id) schema_name, v.name from sys.views as v;
go
--danh sách các trigger
select name, is_instead_of_trigger from sys.triggers where type = 'TR';
go

--insert tài khoản admin
insert into Account(CreationTime, CreatorUserId, IsDeleted, AEmail, APassword, ARole, AName, AIdentityCard, ADoB, AAddress, APhone, APoint) values ('2022-10-22', 1, 0, 'admin@gmail.com', '123456', 2, N'ad văn min', '001122334455', '2001-01-01', N'Hà Nội', '0123456789', 0)
--insert room
declare @AdminId int = (select AId from (select top 1 * from Account) a)
insert into Room(CreationTime, CreatorUserId, IsDeleted, RName, RStatus) values ('2022-10-22', @AdminId, 0, 1, 1)
insert into Room(CreationTime, CreatorUserId, IsDeleted, RName, RStatus) values ('2022-10-22', @AdminId, 0, 2, 1)
insert into Room(CreationTime, CreatorUserId, IsDeleted, RName, RStatus) values ('2022-10-22', @AdminId, 0, 3, 1)
insert into Room(CreationTime, CreatorUserId, IsDeleted, RName, RStatus) values ('2022-10-22', @AdminId, 0, 4, 1)
insert into Room(CreationTime, CreatorUserId, IsDeleted, RName, RStatus) values ('2022-10-22', @AdminId, 0, 5, 1)
insert into Room(CreationTime, CreatorUserId, IsDeleted, RName, RStatus) values ('2022-10-22', @AdminId, 0, 6, 1)
--insert phim
declare @AdminId int = (select AId from (select top 1 * from Account) a)
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Chú khủng long của Nobita', 120, '1980-03-15', 'Japan', 'Hiroshi Fukutomi', 1, N'Truyện phim mở đầu khi Nobita tìm thấy một quả trứng hóa thạch, và bằng bảo bối của Doraemon đã giúp nở ra một chú khủng long hiền lành mà cậu bé đặt tên là Pīsuke. Do không thể nuôi khủng long giữa lòng Tokyo hiện đại, Nobita phải đưa Pīsuke trở về quê nhà ở kỷ Creta, đồng thời tìm cách bảo vệ chú khủng long khỏi sự truy bắt của những tay săn trộm đến từ thế kỷ tương lai.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và lịch sử khai phá vũ trụ', 120, '1981-03-14', 'Japan', 'Hideo Nishimaki', 1, N'Bối cảnh của phim xảy ra luân phiên giữa Trái Đất và Hành tinh Tím qua một cửa không gian thông từ nền phòng Nôbita tới chiếc phi thuyền của những người bạn ở Hành tinh Tím.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita thám hiểm vùng đất mới', 120, '1982-03-13', 'Japan', 'Hideo Nishimaki', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và lâu đài dưới đáy biển', 120, '1983-03-12', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và chuyến phiêu lưu vào xứ quỷ', 120, '1984-03-17', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và cuộc chiến vũ trụ', 120, '1985-03-16', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và binh đoàn người sắt', 120, '1986-03-15', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và hiệp sĩ rồng', 120, '1987-03-14', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita Tây du kí', 120, '1988-03-12', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và nước Nhật thời nguyên thủy', 120, '1989-03-11', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và hành tinh muông thú', 120, '1990-03-10', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita ở xứ sở nghìn lẻ một đêm', 120, '1991-03-09', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và vương quốc trên mây', 120, '1992-03-07', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và mê cung thiếc', 120, '1993-03-06', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và ba chàng hiệp sĩ mộng mơ', 120, '1994-03-12', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Đấng toàn năng Nobita', 120, '1995-03-04', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và chuyến tàu tốc hành Ngân Hà', 120, '1996-03-02', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và cuộc phiêu lưu ở thành phố dây cót', 120, '1997-03-08', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita du hành biển phương Nam', 120, '1998-03-07', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita - Vũ trụ phiêu lưu kí', 120, '1999-03-06', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và truyền thuyết vua Mặt Trời', 120, '2000-03-04', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và những dũng sĩ có cánh', 120, '2001-03-10', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và vương quốc robot', 120, '2002-03-09', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và những pháp sư gió bí ẩn', 120, '2003-03-08', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita ở vương quốc chó mèo', 120, '2004-03-06', 'Japan', 'Shibayama Tsutomu', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Chú khủng long của Nobita 2006', 120, '2006-03-04', 'Japan', 'Kozo Kusube, Ayumu Watanabe', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và chuyến phiêu lưu vào xứ quỷ', 120, '2007-03-10', 'Japan', 'Yukiyo Teramoto', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và người khổng lồ xanh', 120, '2008-03-08', 'Japan', 'Ayumu Watanabe', 1, N'')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và lịch sử khai phá vũ trụ', 120, '2009-03-07', 'Japan', 'Shigeo Koshi', 1, N'Chuyến phiêu lưu kì thú của Nobita và Doraemon tại hành tinh Koyakoya bắt nguồn từ việc sàn căn phòng Nobita kết nối với một phi thuyền người ngoài hành tinh. Bên cạnh đó cậu và các bạn giúp cư dân hành tinh Koyakoya chống lại âm mưu phá hoại của hành tinh đen.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và cuộc đại thủy chiến ở xứ sở người cá', 120, '2010-03-06', 'Japan', 'Kosuba Kozo', 1, N'Nobita muốn bơi lặn ngay trong thành phố Tokyo. Vì vậy, Doraemon đã sử dụng Máy bơm mô phỏng nguồn nước biển nhân tạo để bơm nước ngập đầy thành phố. Đêm đó Doraemon và Nobita sử dụng kính tạo cảm giác và chân vịt bơi lặn để dạo quanh thành phố toàn nước. Bỗng xuất hiện cá mập đe doạ mọi người và Doraemon buộc phải tắt máy bơm. Nhóm bạn phát hiện một cô bé người cá nằm ngất trong lùm cây tên là Sophia. Sophia là ai? Chuyện gì sẽ xảy ra?')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và binh đoàn người sắt', 120, '2011-03-05', 'Japan', 'Teramoto Yukiyo', 1, N'Với hàm ý "Khi sự dũng mãnh và lòng quyết tâm hòa làm một, sức mạnh thực sự sẽ đến", nội dung phim là cuộc chiến giữa nhóm Doraemon với binh đoàn người sắt âm mưu thôn tính Trái Đất.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và hòn đảo diệu kì - Cuộc phiêu lưu của loài thú', 120, '2012-03-03', 'Japan', 'Kusuba Kozo', 1, N'Kể về chuyến phiêu lưu đến hòn đảo kì bí thời tiền sử và những bí ẩn về con bọ vàng Hercules.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và viện bảo tàng bảo bối', 120, '2013-03-09', 'Japan', 'Teramoto Yukiyo', 1, N'Truyện phim mở đầu với hình ảnh Nobita có mơ ước trở thành thám tử như Sherlock Homes và sau đó đột nhiên Doraemon bị một đạo chích của tương lai mang tên Kaitou Deluxe đánh cắp chiếc chuông. Doraemon và những người bạn đến bảo tàng bảo bối thế kỷ 22 truy tìm hành tung tên trộm.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita thám hiểm vùng đất mới', 120, '2014-03-08', 'Japan', 'Nishimaki Hideo', 1, N'Nội dung truyện phim kể về chuyến thám hiểm của Nobita và những người bạn đến vương quốc loài chó ở khu rừng sương muối châu Phi.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và những hiệp sĩ không gian', 120, '2015-03-07', 'Japan', 'Osugi Yoshihiro', 1, N'Được thực hiện bởi đạo diễn Osugi Yoshihiro kỉ niệm 35 năm phim chủ đề Doraemon nội dung kể về hành trình tìm kiếm người hùng trong bạn của Nobita và những người bạn tại Hành tinh Chuột Pokkuru để chống lại âm mưu xấu xa những tên hải tặc vũ trụ.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và Nước Nhật thời nguyên thủy', 120, '2016-03-05', 'Japan', 'Shibayama Tsutomu', 1, N'Truyện lấy bối cảnh hậu thế Pleistocen tại Nhật Bản và Trung Quốc đại lục có một người xấu xa đến từ thế giới tương lai trở lại quá khứ nhằm thôn tính, thay đổi lịch sử nhân loại. Nobita cùng những người bạn vô tình phiêu lưu đến và giúp bộ tộc cổ đại chống lại Gigazombie.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và chuyến thám hiểm Nam Cực Kachi Kochi', 120, '2017-03-04', 'Japan', 'Takahashi Atsushi', 1, N'Câu chuyện kể về chuyến phiêu lưu của nhóm bạn ở một trăm ngàn năm trước tại Nam Cực để giúp những người bạn từ hành tinh Hyoga Hyoga tiêu diệt Blizzaga - kẻ đã đóng băng hành tinh của họ.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và đảo giấu vàng', 120, '2018-03-03', 'Japan', 'Imai Kazuaki', 1, N'Lấy cảm hứng từ tiểu thuyết Đảo giấu vàng của nhà văn Robert Louis Stevenson. Truyện phim kể về hành trình phiêu lưu truy tìm kho báu trên biển khơi Thái Bình Dương của nhóm bạn. Sau đó, Shizuka bị bắt cóc và những người còn lại cùng nhau đến xào quyệt kẻ bắt cóc giải cứu cô bạn. Nhưng rồi cả nhóm nhanh chóng phát hiện thủ lĩnh nhóm bắt cóc — thuyền trưởng Silver, đang âm mưu hủy diệt địa cầu do điên loạn sau sự ra đi của người vợ mà ông hằng yêu quý. Một lần nữa nhóm chiến đấu bảo vệ địa cầu và thức tỉnh thuyền trưởng Silver.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và Mặt Trăng phiêu lưu ký', 120, '2019-03-01', 'Japan', '	Yakuwa Shinnosuke', 1, N'Nội dung phim kể về chuyến phiêu lưu trên Mặt Trăng của nhóm bạn nhờ vào "Huy hiệu thành viên Câu lạc bộ dị thuyết". Cuộc vui nhanh chóng bị gián đoạn khi Nobita và mọi người biết được rằng Luka mang năng lực đặc biệt đang bị một kẻ xấu tấn công và bắt giữ. Cả nhóm nhanh chóng lên đường giải cứu dù gặp nhiều gian nan, trắc trở.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và những bạn khủng long mới', 120, '2020-08-07', 'Japan', 'Imai Kazuaki', 1, N'Truyện phim kể về việc Nobita tìm thấy một quả trứng khủng long hóa thạch trong buổi triển lãm khủng long và nhờ vào bảo bối của Doraemon mà đã nở ra hai con khủng long, cậu đặt tên chúng là Kyū và Myū. Tuy nhiên, do không thể nuôi chúng trong thế giới hiện đại, Nobita quyết định đưa chúng đến Kỷ Phấn Trắng (66 triệu năm trước).')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita và cuộc chiến vũ trụ tí hon 2021', 120, '2022-03-04', 'Japan', 'Yamaguchi Susumu', 1, N'Là bộ phim điện ảnh Nhật Bản thứ 41 trong loạt phim điện ảnh Doraemon do Yamaguchi Susumu đạo diễn và Satō Dai viết kịch bản.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre) values ('2022-10-22', @AdminId, 0, N'Doraemon: Nobita to Sora no Utopia', 120, '2023-03', 'Japan', 'Doyama Takumi', 1)
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Stand by me Doraemon', 120, '2014-08-08', 'Japan', 'Yamazaki Takashi Yagi Ryūichi', 1, N'Dựa trên nhiều mẩu truyện ngắn khác nhau trong manga Doraemon gốc, tác phẩm được biên tập lại thành phim hoàn chỉnh phát hành nhân dịp kỉ niệm 80 năm ngày sinh cố tác giả Fujiko F. Fujio.Nội dung phim kể về Doraemon, một chú mèo máy không tai đến từ tương lai trở về những năm 70 để giúp một cậu bé "vô tích sự" Nobi Nobita thay đổi tương lai đen tối sang một viễn cảnh tương lai tươi sáng vốn sẽ thay đổi số phận của con cháu Nobita về sau và khi Doraemon hoàn tất nhiệm vụ chia tay Nobita cùng với đó là cuộc hội ngộ bất ngờ của họ do chính Nobita tạo ra.')
insert into Movie(CreationTime, CreatorUserId, IsDeleted, MName, MTime, MOpeningDay, MCountry, MDirector, MGenre, MDescription) values ('2022-10-22', @AdminId, 0, N'Stand by me Doraemon 2', 120, '2020-11-20', 'Japan', 'Yamazaki Takashi Yagi Ryūichi', 1, N'Đây là phần phim 3D tiếp nối sau Stand by Me Doraemon phát hành năm 2014, được sản xuất nhằm kỉ niệm 50 năm bộ truyện Doraemon ra đời, chủ yếu lấy cảm hứng từ các chương truyện tranh ngắn do tác giả Fujiko F. Fujio sáng tác và do nhà xuất bản Shogakukan ấn hành, các chương này sau đó từng được chuyển thể thành phim ngắn năm 2000 Kỉ niệm về bà và phim ngắn năm 2002 Ngày tớ ra đời.')
go

	exec CreateShowtimes @CreatorUserId = 1, @MId = 1, @RId = 1, @TTimme = '2022/11/20', @TFormatMovieScreen = 1
	exec CreateShowtimes @CreatorUserId = 1, @MId = 2, @RId = 2, @TTimme = '2022/10/11', @TFormatMovieScreen = 2
	exec CreateShowtimes @CreatorUserId = 1, @MId = 3, @RId = 3, @TTimme = '2022/10/21', @TFormatMovieScreen = 3
	exec CreateShowtimes @CreatorUserId = 1, @MId = 4, @RId = 4, @TTimme = '2022/11/02', @TFormatMovieScreen = 4
	exec CreateShowtimes @CreatorUserId = 1, @MId = 5, @RId = 5, @TTimme = '2022/11/27', @TFormatMovieScreen = 5
	exec CreateShowtimes @CreatorUserId = 1, @MId = 6, @RId = 6, @TTimme = '2022/11/1', @TFormatMovieScreen = 6
