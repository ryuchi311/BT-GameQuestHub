# Admin Access Setup Guide

## 🔐 Admin Login System

The GameQuestHub application now includes a secure admin system with role-based access control.

### Features
- **Secure Login**: Admin-only authentication with password protection
- **Role-Based Access**: Automatic role verification (only admin users can access admin features)
- **Protected Routes**: All admin routes are guarded against unauthorized access
- **Clean UI**: Admin interface clearly distinguished from user interface

### Admin Capabilities
1. **Quest Management**
   - Create new quests with custom parameters
   - Edit existing quests
   - Set difficulty levels, rewards, and verification types
   - Manage daily/sponsored quest flags

2. **Reward Management**
   - Create new rewards (digital, physical, voucher, cryptocurrency)
   - Set point requirements and quantities
   - Toggle reward active/inactive status
   - Manage reward catalog

3. **Manual Quest Verification**
   - Review user quest submissions
   - Approve or reject submissions
   - Add verification notes
   - Track verification history

### How to Create an Admin User

#### Method 1: Direct Database Setup
1. Create a regular user account through the app signup
2. In your Supabase database, update the `users` table:
   ```sql
   UPDATE users 
   SET role = 'admin' 
   WHERE email = 'your-admin-email@example.com';
   ```

#### Method 2: Through Code (Development)
You can modify the signup process temporarily to create admin users:

```typescript
// In AuthContext.tsx, temporarily modify the createUser call:
const newUser = await userService.createUser({
  id: supabaseUser.id,
  email: supabaseUser.email!,
  name: supabaseUser.user_metadata?.name || supabaseUser.email!.split('@')[0],
  role: 'admin', // Change this to 'admin' for admin users
  level: 1,
  xp: 0,
  maxXp: 100,
  points: 10000, // Give admin some points for testing
  questsCompleted: 0,
});
```

### Admin Access URLs
- **Admin Dashboard**: `/admin/dashboard`
- **Quest Management**: `/admin/quests`
- **Reward Management**: `/admin/rewards`
- **Verification Hub**: `/admin/verify`

### Security Features
- **Auto-redirect**: Non-admin users are automatically redirected to login
- **Role Verification**: Continuous checking of user role throughout session
- **Secure Logout**: Admin logout clears all session data
- **Route Protection**: All admin routes require authentication + admin role

### UI Differences for Admin Users
- **Navigation**: Different bottom navigation showing admin tools
- **Header**: Red "ADMIN" badge and logout button
- **Interface**: Admin-specific dashboard and management tools

### Testing the Admin System
1. Create an admin user using one of the methods above
2. Visit the application
3. Try accessing `/admin` - you should see the login screen
4. Login with admin credentials
5. Verify you can access all admin features

### Default Admin Test Account (Development Only)
For testing purposes, you can create a test admin account:
- **Email**: `admin@gamequesthub.test`
- **Password**: `admin123456`
- **Role**: `admin`

Remember to remove or change these credentials in production!

### Troubleshooting
- **Can't access admin routes**: Verify the user role is set to 'admin' in the database
- **Login fails**: Check Supabase auth configuration and credentials
- **Role not updating**: Clear browser cache and localStorage, then login again

The admin system is now fully functional and ready for managing your GameQuestHub platform!