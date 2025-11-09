-- Temporary Admin User Creation Script
-- Run this in your Supabase SQL Editor or psql

-- First, let's see what columns exist in the users table
-- \d users

-- Create the admin user (or update if exists)
-- Step 1: Insert or update auth.users (Supabase Auth table)
INSERT INTO auth.users (
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
) VALUES (
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'ryuchicago@gmail.com',
    crypt('123456', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Admin User"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
) ON CONFLICT (email) 
DO UPDATE SET 
    encrypted_password = crypt('123456', gen_salt('bf')),
    updated_at = now()
RETURNING id;

-- Step 2: Insert or update the custom users table
-- Note: You'll need to adjust column names based on your actual schema
INSERT INTO public.users (
    id,
    name,
    email,
    role,
    level,
    xp,
    "maxXp",
    points,
    "questsCompleted",
    "createdAt"
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'ryuchicago@gmail.com'),
    'Admin User',
    'ryuchicago@gmail.com',
    'admin',
    1,
    0,
    100,
    10000,
    0,
    now()
) ON CONFLICT (email) 
DO UPDATE SET 
    role = 'admin',
    points = 10000,
    "updatedAt" = now();

-- Verify the admin user was created
SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    u.points,
    au.created_at as auth_created_at
FROM public.users u
JOIN auth.users au ON u.id = au.id
WHERE u.email = 'ryuchicago@gmail.com';