# Auth0 Setup Instructions for Bag by Bag

## 🚀 Quick Setup Guide

Your Auth0 integration is ready! Follow these steps to complete the setup:

### 1. Create Auth0 Account & Application

1. **Sign up for Auth0**: Go to [auth0.com](https://auth0.com) and create a free account
2. **Create a new Application**:
   - Go to Applications → Create Application
   - Name: "Bag by Bag"
   - Type: **Single Page Application**
   - Technology: **React**

### 2. Configure Your Application

#### Application Settings
In your Auth0 dashboard, go to Applications → Your App → Settings:

**Allowed Callback URLs:**
```
http://localhost:5173
http://localhost:3000
```

**Allowed Logout URLs:**
```
http://localhost:5173
http://localhost:3000
```

**Allowed Web Origins:**
```
http://localhost:5173
http://localhost:3000
```

#### API Settings (Optional but Recommended)
1. Go to APIs → Create API
2. Name: "Bag by Bag API"
3. Identifier: `https://bagbybag.com/api`
4. Signing Algorithm: RS256

### 3. Set Up User Roles

#### Create Roles
1. Go to User Management → Roles
2. Create two roles:
   - **customer** (for regular users)
   - **restaurant** (for restaurant owners)

#### Assign Roles to Users
1. Go to User Management → Users
2. Create test users or use existing ones
3. For each user, go to their profile → Roles tab
4. Assign appropriate role (customer or restaurant)

### 4. Configure Environment Variables

Open your `.env.local` file and replace the placeholder values:

```env
# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=https://bagbybag.com/api
VITE_AUTH0_REDIRECT_URI=http://localhost:5173
```

**Where to find these values:**
- **Domain**: Applications → Your App → Settings → Domain
- **Client ID**: Applications → Your App → Settings → Client ID
- **Audience**: APIs → Your API → Settings → Identifier (if you created an API)

### 5. Test the Integration

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Test Authentication**:
   - Go to the Profile tab
   - Click "Sign in as Customer" or "Sign in as Restaurant"
   - Complete the Auth0 login flow
   - Verify you're redirected back to your app

### 6. Role-Based Features

The app automatically detects user roles and shows appropriate features:

- **Customers**: Can browse, add to cart, and make purchases
- **Restaurants**: Can access the Admin Dashboard to manage their restaurant

### 7. Customization Options

#### Custom Login Experience
You can customize the Auth0 login experience by:
1. Going to Branding → Universal Login
2. Customizing the login page theme and logo
3. Adding custom CSS

#### User Metadata
To store additional user information, you can use:
- **User Metadata**: For user preferences
- **App Metadata**: For role assignments and business logic

### 8. Production Deployment

When deploying to production:

1. **Update Environment Variables**:
   ```env
   VITE_AUTH0_DOMAIN=your-production-domain.auth0.com
   VITE_AUTH0_CLIENT_ID=your-production-client-id
   VITE_AUTH0_AUDIENCE=https://your-production-api.com
   VITE_AUTH0_REDIRECT_URI=https://your-production-app.com
   ```

2. **Update Auth0 Application Settings**:
   - Add your production URLs to Allowed Callback URLs
   - Add your production URLs to Allowed Logout URLs
   - Add your production URLs to Allowed Web Origins

### 9. Security Best Practices

- ✅ Never commit `.env.local` to version control
- ✅ Use HTTPS in production
- ✅ Regularly rotate your Auth0 secrets
- ✅ Monitor Auth0 logs for suspicious activity
- ✅ Use the latest version of the Auth0 React SDK

### 10. Troubleshooting

#### Common Issues:

**"Invalid redirect URI"**
- Check that your callback URLs in Auth0 match your environment variables

**"User not found"**
- Ensure users are created in Auth0 and have proper roles assigned

**"Access denied"**
- Check that your API audience is correctly configured

**Environment variables not loading**
- Restart your development server after updating `.env.local`
- Ensure variable names start with `VITE_`

### 11. Support

- **Auth0 Documentation**: [auth0.com/docs](https://auth0.com/docs)
- **Auth0 Community**: [community.auth0.com](https://community.auth0.com)
- **Auth0 Support**: Available in your Auth0 dashboard

---

## 🎉 You're All Set!

Your Bag by Bag app now has:
- ✅ Secure authentication with Auth0
- ✅ Role-based access (Customer vs Restaurant)
- ✅ Beautiful login UI that matches your app design
- ✅ Automatic user profile management
- ✅ Secure logout functionality

The authentication is fully integrated with your existing UI/UX, so users will have a seamless experience!
