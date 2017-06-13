-- Creates 2 user accounts
-- user@example.org and admin@example.org
-- Both have password: test
INSERT INTO `user_group` (`id`, `name`) VALUES
  (2, 'Admin'),
  (1, 'Gebruiker');

INSERT INTO `user` (`id`, `email`, `password`, `name`, `group_id`, `session_token`, `expiration_date`) VALUES
(1, 'user@example.org', '$2a$10$q52o0OwviZlzjTpQmttFMeVvnx41lrtgEm44OrbHwHJrgxmqbD/vW', 'Test User', 1, NULL, NULL),
(2, 'admin@example.org', '$2a$10$dxcKylVFnfeM2mdLXDx.F.2lVC/2HcHJqutXYw/iREBfzkvmKIJDK', 'Test Admin', 2, NULL, NULL);
