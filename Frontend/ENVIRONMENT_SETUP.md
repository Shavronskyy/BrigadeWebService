# Environment Configuration Setup

This project now supports different configurations for development and production environments.

## 🚀 Quick Start

### Development Mode

```bash
npm run start:dev
```

- Uses `http://localhost:7234` as API base URL
- Enables debug logging
- Sets up proxy for API calls

### Production Mode

```bash
npm run start:prod
```

- Uses relative API paths (no proxy)
- Disables debug logging
- Optimized for production deployment

## 📁 Configuration Files

### `env.development`

```env
REACT_APP_ENV=development
REACT_APP_API_BASE_URL=http://localhost:7234
REACT_APP_API_TIMEOUT=10000
REACT_APP_DEBUG=true
```

### `env.production`

```env
REACT_APP_ENV=production
REACT_APP_API_BASE_URL=
REACT_APP_API_TIMEOUT=15000
REACT_APP_DEBUG=false
```

## 🛠️ Available Scripts

| Script               | Description              | Environment |
| -------------------- | ------------------------ | ----------- |
| `npm run start:dev`  | Start development server | Development |
| `npm run start:prod` | Start production server  | Production  |
| `npm run build:dev`  | Build for development    | Development |
| `npm run build:prod` | Build for production     | Production  |

## 🔧 How It Works

1. **Environment Files**: Each environment has its own configuration file
2. **Scripts**: The npm scripts copy the appropriate environment file to `.env`
3. **React**: React automatically loads environment variables from `.env`
4. **Proxy**: Development mode sets up a proxy to `localhost:7234`
5. **Production**: Production mode uses relative paths (handled by Nginx)

## 🐳 Docker Integration

The production configuration works seamlessly with your Docker setup:

- Nginx handles API routing in production
- No proxy needed in production mode
- Environment variables are properly configured

## 🔍 Debugging

In development mode, you'll see console logs showing:

- Current environment
- API base URL
- Proxy configuration
- Request/response details

## 📝 Notes

- Environment files are automatically copied to `.env` when running scripts
- The `.env` file is gitignored and should not be committed
- All environment variables must start with `REACT_APP_` to be accessible in React
