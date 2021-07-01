create DATABASE jairosa;
use jairosa;

create table usuarios(
	id int primary key auto_increment not null,
	nameComplete char(30) not null,
	email varchar(255) unique not null,
	user char(40) unique not null,
	password char(255) not null,
    rol char(40) not null, -- se tendra dos roles admin, user
    date_create date not null, -- fecha de creacion del registro
    restricted varchar(150) not null, -- si el usuario esta habilitado para mostrarse en la visual del admin
    date_update date not null -- fecha de actualizacion del registro
);

DESCRIBE usuarios;

INSERT INTO usuarios (nameComplete,email,user,password,rol,date_create,restricted,date_update) VALUES('admin','admin@admin','admin',md5('admon321'),'admin','2021-06-30','1','2021-06-30');
