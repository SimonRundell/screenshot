CREATE DATABASE IF NOT EXISTS screenshot
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE screenshot;

CREATE TABLE users (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  username             VARCHAR(50)  NOT NULL UNIQUE,
  email                VARCHAR(255) NOT NULL UNIQUE,
  password_hash        VARCHAR(255) NOT NULL,
  verified             TINYINT(1)   NOT NULL DEFAULT 0,
  verification_token   VARCHAR(64)  DEFAULT NULL,
  verification_expires DATETIME     DEFAULT NULL,
  reset_token          VARCHAR(64)  DEFAULT NULL,
  reset_expires        DATETIME     DEFAULT NULL,
  created_at           DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE images (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT          NOT NULL,
  filename    VARCHAR(255) NOT NULL,
  label       VARCHAR(255) DEFAULT NULL,
  captured_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
  expires_at  DATETIME     NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE colours (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  user_id   INT          NOT NULL,
  image_id  INT          DEFAULT NULL,
  hex       VARCHAR(7)   NOT NULL,
  rgb_r     TINYINT UNSIGNED NOT NULL,
  rgb_g     TINYINT UNSIGNED NOT NULL,
  rgb_b     TINYINT UNSIGNED NOT NULL,
  hsl_h     SMALLINT UNSIGNED NOT NULL,
  hsl_s     TINYINT UNSIGNED NOT NULL,
  hsl_l     TINYINT UNSIGNED NOT NULL,
  label     VARCHAR(255) DEFAULT NULL,
  saved_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)  REFERENCES users(id)   ON DELETE CASCADE,
  FOREIGN KEY (image_id) REFERENCES images(id)  ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE palettes (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT          NOT NULL,
  name       VARCHAR(255) NOT NULL,
  created_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE palette_colours (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  palette_id INT NOT NULL,
  colour_id  INT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_palette_colour (palette_id, colour_id),
  FOREIGN KEY (palette_id) REFERENCES palettes(id) ON DELETE CASCADE,
  FOREIGN KEY (colour_id)  REFERENCES colours(id)  ON DELETE CASCADE
) ENGINE=InnoDB;
