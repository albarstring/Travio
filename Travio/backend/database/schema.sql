-- ============================================================
-- Travio Blog CMS — Database Schema
-- Run this file once to set up the database.
-- ============================================================

CREATE DATABASE IF NOT EXISTS travio_blog
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE travio_blog;

-- ------------------------------------------------------------
-- Table: admins
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  id       INT          NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: blogs
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blogs (
  id          INT           NOT NULL AUTO_INCREMENT,
  title       VARCHAR(255)  NOT NULL,
  slug        VARCHAR(255)  NOT NULL UNIQUE,
  content     LONGTEXT      NOT NULL,
  cover_image VARCHAR(255)  DEFAULT NULL,
  author      VARCHAR(100)  NOT NULL DEFAULT 'Admin',
  views_count INT           NOT NULL DEFAULT 0,
  status      ENUM('draft','published') NOT NULL DEFAULT 'draft',
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_slug   (slug),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
