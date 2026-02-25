-- Script de creación de la base de datos Autolavado
-- ================================================

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS autolavadoDB;
USE autolavadoDB;

-- Tabla de Roles
CREATE TABLE IF NOT EXISTS tbc_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(60) NOT NULL,
    estatus BOOLEAN DEFAULT TRUE,
    INDEX idx_estatus (estatus)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS tbb_users (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    rol_Id INT NOT NULL,
    nombre VARCHAR(60) NOT NULL,
    papellido VARCHAR(60) NOT NULL,
    sapellido VARCHAR(60),
    usuario VARCHAR(60) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    telefono VARCHAR(10),
    estatus BOOLEAN DEFAULT TRUE,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_Id) REFERENCES tbc_roles(id) ON DELETE RESTRICT,
    INDEX idx_usuario (usuario),
    INDEX idx_estatus (estatus),
    INDEX idx_rol_Id (rol_Id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Clientes
CREATE TABLE IF NOT EXISTS tbc_cliente (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(60) NOT NULL,
    papellido VARCHAR(60) NOT NULL,
    sapellido VARCHAR(60),
    direccion VARCHAR(60),
    telefono VARCHAR(10),
    estatus BOOLEAN DEFAULT TRUE,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre),
    INDEX idx_estatus (estatus)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Servicios
CREATE TABLE IF NOT EXISTS tbc_servicio (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(60) NOT NULL,
    descripcion VARCHAR(60),
    costo INT NOT NULL,
    estatus BOOLEAN DEFAULT TRUE,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre),
    INDEX idx_estatus (estatus)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Vehículos
CREATE TABLE IF NOT EXISTS tbb_vehiculo (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_Id INT NOT NULL,
    matricula VARCHAR(60) NOT NULL UNIQUE,
    modelo VARCHAR(60) NOT NULL,
    color VARCHAR(60),
    numero_del_dueno VARCHAR(60),
    estatus BOOLEAN DEFAULT TRUE,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_Id) REFERENCES tbc_cliente(Id) ON DELETE RESTRICT,
    INDEX idx_matricula (matricula),
    INDEX idx_cliente_Id (cliente_Id),
    INDEX idx_estatus (estatus)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Servicios por Vehículo
CREATE TABLE IF NOT EXISTS tbd_serviciovehiculo (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    cajero_Id INT NOT NULL,
    lavador_Id INT NOT NULL,
    servicio_Id INT NOT NULL,
    vehiculo_Id INT NOT NULL,
    fecha DATETIME NOT NULL,
    estatus BOOLEAN DEFAULT TRUE,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cajero_Id) REFERENCES tbb_users(Id) ON DELETE RESTRICT,
    FOREIGN KEY (lavador_Id) REFERENCES tbb_users(Id) ON DELETE RESTRICT,
    FOREIGN KEY (servicio_Id) REFERENCES tbc_servicio(Id) ON DELETE RESTRICT,
    FOREIGN KEY (vehiculo_Id) REFERENCES tbb_vehiculo(Id) ON DELETE RESTRICT,
    INDEX idx_fecha (fecha),
    INDEX idx_vehiculo_Id (vehiculo_Id),
    INDEX idx_servicio_Id (servicio_Id),
    INDEX idx_estatus (estatus)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de ejemplo (Opcional)
-- Roles
INSERT INTO tbc_roles (description, estatus) VALUES 
('Administrador', TRUE),
('Cajero', TRUE),
('Lavador', TRUE),
('Cliente', TRUE);

-- Mostrar información de las tablas creadas
SHOW TABLES;
DESCRIBE tbc_roles;
DESCRIBE tbb_users;
DESCRIBE tbc_cliente;
DESCRIBE tbc_servicio;
DESCRIBE tbb_vehiculo;
DESCRIBE tbd_serviciovehiculo;
