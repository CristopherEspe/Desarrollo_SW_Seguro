-- CREATE DATABASE IF NOT EXISTS msvc_auth;

SELECT 'CREATE DATABASE msvc-auth'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'msvc-auth');