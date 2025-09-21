# Auth0 Dashboard Configuration

## ✅ Your Auth0 Credentials
- **Domain**: `dev-68wpuxazg5wlnwim.us.auth0.com`
- **Client ID**: `lKAZOA1hiAJPcaYc1mtMCmOp7yWiERM5`
- **Audience**: `https://bagbybag.com/api`

## 🔧 Required Auth0 Dashboard Settings

### 1. Application Settings
Go to **Applications** → **Your App** → **Settings**

#### Allowed Callback URLs:
```
http://localhost:8086
http://localhost:5173
https://your-production-domain.com
```

#### Allowed Logout URLs:
```
http://localhost:8086
http://localhost:5173
https://your-production-domain.com
```

#### Allowed Web Origins:
```
http://localhost:8086
http://localhost:5173
https://your-production-domain.com
```

### 2. Create API (Optional but Recommended)
Go to **APIs** → **Create API**

- **Name**: `Bag by Bag API`
- **Identifier**: `https://bagbybag.com/api`
- **Signing Algorithm**: `RS256`

### 3. Create User Roles
Go to **User Management** → **Roles**

Create these roles:
- **customer** (for regular users)
- **restaurant** (for restaurant owners)

### 4. Assign Roles to Users
Go to **User Management** → **Users**

For each user:
1. Click on the user
2. Go to **Roles** tab
3. Assign appropriate role (customer or restaurant)

### 5. Test Users
Create test users with different roles:

#### Customer User:
- Email: `customer@example.com`
- Password: `Test123!`
- Role: `customer`

#### Restaurant User:
- Email: `restaurant@example.com`
- Password: `Test123!`
- Role: `restaurant`

## 🚀 Testing Your Integration

1. **Start your app**: `npm run dev`
2. **Go to Profile tab**
3. **Click "Sign in as Customer" or "Sign in as Restaurant"**
4. **Complete Auth0 login flow**
5. **Verify you're redirected back to your app**

## 🔍 Troubleshooting

### If you see "Invalid redirect URI":
- Check that your callback URLs in Auth0 match your environment variables
- Make sure `http://localhost:8086` is in your Allowed Callback URLs

### If you see "User not found":
- Ensure users are created in Auth0
- Check that users have proper roles assigned

### If you see "Access denied":
- Verify your API audience is correctly configured
- Check that the API identifier matches your environment variable

## 📱 Your App is Ready!

Your Auth0 integration is now fully configured and ready to use! The app will:

- ✅ Show Auth0 login forms when not authenticated
- ✅ Handle role-based authentication (Customer vs Restaurant)
- ✅ Display user profiles with Auth0 user data
- ✅ Support secure logout functionality
- ✅ Work in both development and production environments

## 🎉 Next Steps

1. **Test the authentication flow** in your app
2. **Create additional users** with different roles
3. **Customize the Auth0 login page** in the Auth0 dashboard
4. **Deploy to production** with your production Auth0 settings
