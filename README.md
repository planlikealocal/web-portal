# Web Portal - Laravel + Inertia.js + React + Material UI

A comprehensive web portal built with Laravel 12, Inertia.js, React.js, and Material UI (MUI) following SOLID principles. This project features a public website and an admin portal for specialist management.

## 🚀 Features

### Website (Public)
- **Home Page**: Welcome page with feature highlights
- **About Page**: Information about the platform
- **Contact Page**: Contact form and information
- **Responsive Design**: Built with Material UI components

### Admin Portal
- **Authentication**: Admin login with role-based access
- **Dashboard**: Overview with statistics and quick actions
- **Specialist Management**: Full CRUD operations with MUI DataGrid
- **Role-based Middleware**: Secure admin-only access

### Specialist Management
- **List View**: DataGrid with pagination, sorting, and filtering
- **Create/Edit**: Modal forms for adding and editing specialists
- **Delete**: Confirmation dialogs for safe deletion
- **Status Management**: Active/Inactive status tracking
- **Trip Tracking**: Number of trips per specialist

## 🛠️ Technology Stack

### Backend
- **Laravel 12**: Latest stable version
- **Inertia.js**: Modern SPA framework
- **MySQL/SQLite**: Database support
- **SOLID Principles**: Clean, maintainable code architecture

### Frontend
- **React 19**: Latest React version
- **Material UI (MUI)**: Modern component library
- **MUI DataGrid**: Professional data table component
- **Emotion**: CSS-in-JS styling

### Development Tools
- **Vite**: Fast build tool
- **Concurrently**: Run multiple development servers
- **Laravel Sail**: Docker development environment

## 📋 Requirements

- PHP 8.2+
- Node.js 18+
- Composer
- MySQL/SQLite

## 🚀 Quick Start

### For Junior Developers (Recommended)
We've created a comprehensive setup guide and automated scripts to get you started quickly:

1. **Follow the detailed setup guide**: [DEVELOPMENT_SETUP.md](doc/DEVELOPMENT_SETUP.md)
2. **Or run the quick start script**:
   ```bash
   git clone git@github.com:planlikealocal/web-portal.git
   cd web-portal
   ./quick-start.sh
   ```

### Manual Installation (Advanced)

1. **Clone the repository**
   ```bash
   git clone git@github.com:planlikealocal/web-portal.git
   cd web-portal
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Database setup**
   ```bash
   php artisan migrate
   php artisan db:seed --class=SpecialistSeeder
   ```

6. **Create admin user**
   ```bash
   php artisan make:admin-user admin@example.com password123
   ```

7. **Build assets**
   ```bash
   npm run build
   ```

## 🎯 Usage

### Development Server
```bash
# Start Laravel development server
php artisan serve

# Start Vite development server (in another terminal)
npm run dev

# Or use the combined development command
composer run dev
```

### Production Build
```bash
npm run build
php artisan serve
```

## 🔐 Admin Access

- **URL**: `/admin`
- **Login**: Use the admin credentials created with the artisan command
- **Default**: `admin@example.com` / `password123`

## 📊 Specialist Data Structure

```json
{
  "id": "Primary Key",
  "first_name": "string",
  "last_name": "string", 
  "contact_no": "string",
  "country": "string",
  "state_province": "string",
  "city": "string",
  "address": "text",
  "postal_code": "string",
  "status": "enum(active,inactive)",
  "no_of_trips": "integer"
}
```

## 🏗️ Project Structure

```
app/
├── Console/Commands/
│   └── MakeAdminUser.php          # Artisan command for admin creation
├── Http/
│   ├── Controllers/
│   │   ├── Admin/
│   │   │   ├── AuthController.php     # Admin authentication
│   │   │   ├── DashboardController.php # Admin dashboard
│   │   │   └── SpecialistController.php # Specialist CRUD
│   │   └── WebsiteController.php     # Public website pages
│   └── Middleware/
│       ├── AdminMiddleware.php        # Role-based access control
│       └── HandleInertiaRequests.php  # Inertia.js middleware
├── Models/
│   ├── User.php                       # User model with roles
│   └── Specialist.php                 # Specialist model
└── ...

resources/
├── js/
│   ├── Components/
│   │   └── SpecialistFormDialog.jsx   # Specialist form modal
│   ├── Layouts/
│   │   ├── AdminLayout.jsx            # Admin portal layout
│   │   └── WebsiteLayout.jsx          # Public website layout
│   ├── Pages/
│   │   ├── Admin/
│   │   │   ├── Dashboard.jsx           # Admin dashboard
│   │   │   ├── Login.jsx              # Admin login
│   │   │   └── List.jsx        # Specialist management
│   │   ├── About.jsx                  # About page
│   │   ├── Contact.jsx                # Contact page
│   │   └── Home.jsx                   # Home page
│   └── app.jsx                        # Main React app
└── views/
    └── app.blade.php                   # Inertia.js root template
```

## 🔧 Artisan Commands

### Create Admin User
```bash
php artisan make:admin-user {email} {password}
```

Example:
```bash
php artisan make:admin-user admin@company.com securepassword123
```

## 🎨 UI Components

### Material UI Components Used
- **AppBar**: Navigation bars
- **Drawer**: Sidebar navigation
- **DataGrid**: Professional data tables
- **Dialog**: Modal forms and confirmations
- **TextField**: Form inputs
- **Button**: Action buttons
- **Card**: Content containers
- **Typography**: Text styling

### Layouts
- **WebsiteLayout**: Public site with header, main content, and footer
- **AdminLayout**: Admin portal with sidebar navigation and top bar

## 🔒 Security Features

- **Role-based Authentication**: Admin-only access to admin routes
- **CSRF Protection**: Laravel's built-in CSRF protection
- **Input Validation**: Server-side validation for all forms
- **SQL Injection Protection**: Eloquent ORM protection
- **XSS Protection**: Inertia.js automatic escaping

## 🧪 Testing

```bash
# Run PHP tests
php artisan test

# Run with coverage
php artisan test --coverage
```

## 📝 API Routes

### Website Routes
- `GET /` - Home page
- `GET /about` - About page  
- `GET /contact` - Contact page

### Admin Routes
- `GET /admin/login` - Admin login form
- `POST /admin/login` - Admin login
- `POST /admin/logout` - Admin logout
- `GET /admin` - Admin dashboard
- `GET /admin/specialists` - Specialist list
- `POST /admin/specialists` - Create specialist
- `PUT /admin/specialists/{id}` - Update specialist
- `DELETE /admin/specialists/{id}` - Delete specialist

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Laravel team for the excellent framework
- Inertia.js team for seamless SPA experience
- Material-UI team for beautiful components
- React team for the amazing library

## 📞 Support

For support, email support@webportal.com or create an issue in the repository.

---

**Built with ❤️ using Laravel, React, and Material UI**
