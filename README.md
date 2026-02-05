# Student Portal - React App (JavaScript + CSS)

A complete student management system built with **React**, **JavaScript**, and **pure CSS**. Features email-linked results where each student can only view their own grades.

## 🚀 Key Features

### ✅ Core Functionality
- **User Authentication**: Login and Signup with localStorage
- **Role-Based Access Control (RBAC)**: Student, Teacher, and Admin roles
- **Protected Routes**: Secure pages that require authentication
- **Context API**: Global state management for user authentication
- **Local Storage**: Persistent storage for user registration and session
- **Email-Linked Results**: Each student can only view their own results

### 🔐 Privacy & Security
- **Personalized Results**: Roll numbers linked to email addresses
- **Privacy Protection**: Users can only see their own grades
- **Session Management**: Automatic login persistence
- **Role-Based Access**: Different permissions for different user types

### 🎨 UI/UX Features
- **Pure CSS**: No CSS frameworks, custom styling
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Gradient Backgrounds**: Modern purple theme
- **Smooth Animations**: Loading states and transitions
- **Color-Coded Grades**: Visual grade badges (A/B/C/D/F)

## 📦 Tech Stack

- **React**: 18.2.0
- **React Router DOM**: 6.21.0 (for routing)
- **JavaScript**: ES6+
- **CSS**: Pure CSS (no frameworks)
- **Axios**: For API calls
- **Local Storage**: Browser storage for data persistence

## 🚀 Quick Start

### Installation

1. **Navigate to project directory**:
```bash
cd student-portal-react
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start development server**:
```bash
npm start
```

4. **Open browser**:
Go to **http://localhost:3000**

## 📖 How It Works

### 1. Email-Linked Results System

Each user's email is linked to their roll number and results. When a student logs in, they automatically see only their own results.

**Example:**
- User: `ali@example.com` → Roll Number: `2024-001`
- User: `sara@example.com` → Roll Number: `2024-002`
- User: `hassan@example.com` → Roll Number: `2024-003`

### 2. Demo Accounts

You can test with these pre-configured accounts:

| Email | Password | Roll No | Results |
|-------|----------|---------|---------|
| ali@example.com | password123 | 2024-001 | Good grades |
| sara@example.com | password123 | 2024-002 | Excellent grades |
| hassan@example.com | password123 | 2024-003 | Average grades |

### 3. Creating New Accounts

1. Click "Sign Up"
2. Fill in all required fields:
   - Name
   - Father's Name
   - NIC Number
   - Class
   - Roll Number (important!)
   - Email Address
   - Password
   - Role
3. Your email will be linked to your roll number
4. Login to view your results

## 📁 Project Structure

```
student-portal-react/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   └── ProtectedRoute.js   # Route protection with RBAC
│   ├── context/
│   │   └── AuthContext.js      # Context API for auth
│   ├── pages/
│   │   ├── Login.js            # Login page
│   │   ├── Signup.js           # Registration page
│   │   ├── Dashboard.js        # Main dashboard with results
│   │   └── Unauthorized.js     # Access denied page
│   ├── services/
│   │   └── api.js              # API calls & email-linked data
│   ├── styles/
│   │   └── App.css             # All CSS styles
│   ├── App.js                  # Main app with routing
│   └── index.js                # Entry point
├── package.json                # Dependencies
└── README.md                   # This file
```

## 🔐 Privacy Features Explained

### Email-Results Linking

In `src/services/api.js`, results are stored by email:

```javascript
const resultsDatabase = {
  'ali@example.com': {
    rollNo: '2024-001',
    // ... student data and results
  },
  'sara@example.com': {
    rollNo: '2024-002',
    // ... student data and results
  }
};
```

### Fetching Personal Results

```javascript
export const fetchStudentResults = async (userEmail) => {
  const results = resultsDatabase[userEmail.toLowerCase()];
  // Returns only results for the logged-in user's email
};
```

### Dashboard Auto-Load

When you login, the dashboard automatically loads YOUR results based on your email. No need to enter roll number - it's all personalized!

## 🎯 How to Add New Students

### Option 1: Via Signup (Recommended)
1. User signs up with their information
2. System stores their data in localStorage
3. Admin adds their results to the database

### Option 2: Manually Add Results

Edit `src/services/api.js`:

```javascript
const resultsDatabase = {
  // ... existing entries
  'newemail@example.com': {
    rollNo: '2024-004',
    studentName: 'New Student',
    class: '10th Grade',
    fatherName: 'Father Name',
    email: 'newemail@example.com',
    subjects: [
      { 
        name: 'Mathematics', 
        total: 100, 
        obtained: 85, 
        percentage: 85, 
        grade: 'A', 
        remarks: 'Excellent' 
      },
      // ... more subjects
    ]
  }
};
```

## 🎨 Customization

### Change Colors

Edit `src/styles/App.css`:

```css
/* Change gradient background */
body {
  background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}

/* Change primary button color */
.btn-primary {
  background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}
```

### Modify Grade Colors

```css
.grade-A { background: #10b981; } /* Green */
.grade-B { background: #3b82f6; } /* Blue */
.grade-C { background: #f59e0b; } /* Orange */
/* ... etc */
```

## 🔧 Common Tasks

### Add More Subjects

In `src/services/api.js`, add more subject entries:

```javascript
subjects: [
  // ... existing subjects
  { 
    name: 'Biology', 
    total: 100, 
    obtained: 80, 
    percentage: 80, 
    grade: 'A', 
    remarks: 'Very Good' 
  }
]
```

### Change Required Fields

Edit `src/pages/Signup.js` to add/remove form fields.

### Add Admin Panel

Create a new protected route in `src/App.js`:

```javascript
<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminPanel />
    </ProtectedRoute>
  }
/>
```

## 🚀 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## 📱 Responsive Design

The app is fully responsive and works on:
- ✅ Desktop computers (1920px+)
- ✅ Laptops (1366px - 1920px)
- ✅ Tablets (768px - 1366px)
- ✅ Mobile phones (320px - 768px)

## 🔒 Security Notes

**For Production:**
1. Use a real backend API (Node.js, Django, etc.)
2. Hash passwords with bcrypt
3. Use JWT tokens from server
4. Implement HTTPS
5. Add CSRF protection
6. Use environment variables for secrets
7. Implement rate limiting
8. Add input validation on server

## 🐛 Troubleshooting

### Issue: Port 3000 already in use
```bash
# Use different port
PORT=3001 npm start
```

### Issue: Dependencies not installing
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Results not showing
- Make sure you're logged in with one of the demo accounts
- Check that the email matches exactly (case-insensitive)
- Open browser console for error messages

### Issue: Page not updating
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check localStorage in DevTools

## 📚 Key Differences from Next.js Version

| Feature | React Version | Next.js Version |
|---------|--------------|-----------------|
| Framework | React | Next.js 14 |
| Language | JavaScript | TypeScript |
| Styling | Pure CSS | Tailwind CSS |
| Routing | React Router | File-based routing |
| Results | Email-linked | Roll number search |
| Privacy | Built-in | Manual search |

## 💡 Why Email-Linked Results?

**Benefits:**
1. **Better Privacy**: Students can't see others' results
2. **Automatic Loading**: No need to remember roll numbers
3. **Personalized**: Each login shows only your data
4. **Secure**: Results tied to authenticated email
5. **User-Friendly**: One less step for students

## 🎓 Learning Resources

- **React**: https://react.dev/
- **React Router**: https://reactrouter.com/
- **JavaScript ES6**: https://es6-features.org/
- **CSS**: https://developer.mozilla.org/en-US/docs/Web/CSS

## 📝 Future Enhancements

- [ ] Backend API integration
- [ ] Real database (MongoDB, PostgreSQL)
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Profile picture upload
- [ ] Export results to PDF
- [ ] Teacher dashboard to manage results
- [ ] Admin panel for user management
- [ ] Attendance tracking
- [ ] Grade history/trends
- [ ] Parent portal access

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize!

## 📄 License

Open source for educational purposes.

---

**Built with ❤️ using React, JavaScript, and CSS**

Your personalized student portal is ready! Each student sees only their own results. 🎓✨
