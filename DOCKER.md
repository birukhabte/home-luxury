# Docker Setup Guide

This guide explains how to run the Addis Majlis Glory application using Docker.

## Prerequisites

- Docker installed (version 20.10 or higher)
- Docker Compose installed (version 2.0 or higher)

## Project Structure

```
.
├── docker-compose.yml          # Production configuration
├── docker-compose.dev.yml      # Development configuration
├── Dockerfile                  # Frontend production Dockerfile
├── Dockerfile.dev              # Frontend development Dockerfile
├── nginx.conf                  # Nginx configuration for frontend
├── .dockerignore              # Frontend Docker ignore file
├── .env.example               # Frontend environment variables example
├── backend/
│   ├── Dockerfile             # Backend production Dockerfile
│   ├── Dockerfile.dev         # Backend development Dockerfile
│   ├── .dockerignore          # Backend Docker ignore file
│   └── .env.example           # Backend environment variables example
```

## Quick Start

### Production Mode

1. **Set up environment variables:**

   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

   Create a `.env` file in the backend directory:
   ```bash
   cp backend/.env.example backend/.env
   ```

   Edit both `.env` files with your actual values.

2. **Build and run the containers:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - Frontend: http://localhost
   - Backend API: http://localhost:4000

4. **View logs:**
   ```bash
   docker-compose logs -f
   ```

5. **Stop the containers:**
   ```bash
   docker-compose down
   ```

### Development Mode

1. **Set up environment variables** (same as production)

2. **Build and run in development mode:**
   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

4. **Features in development mode:**
   - Hot reload for both frontend and backend
   - Source code mounted as volumes
   - Development dependencies included

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000
VITE_CHAPA_PUBLIC_KEY=your_chapa_public_key_here
```

### Backend (backend/.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CHAPA_SECRET_KEY=your_chapa_secret_key
FRONTEND_URL=http://localhost:5173
```

## Useful Docker Commands

### View running containers
```bash
docker ps
```

### View all containers (including stopped)
```bash
docker ps -a
```

### Stop all containers
```bash
docker-compose down
```

### Remove all containers and volumes
```bash
docker-compose down -v
```

### Rebuild containers (after code changes)
```bash
docker-compose up -d --build
```

### View logs for a specific service
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Execute commands inside a container
```bash
docker-compose exec backend sh
docker-compose exec frontend sh
```

### Remove unused Docker resources
```bash
docker system prune -a
```

## Production Deployment

For production deployment, you should:

1. **Update environment variables** with production values
2. **Use a reverse proxy** (like Nginx or Traefik) for SSL/TLS
3. **Set up proper domain names** and update CORS settings
4. **Configure MongoDB** with proper authentication
5. **Use Docker secrets** for sensitive data
6. **Set up monitoring** and logging
7. **Configure backups** for your database

### Example with custom domain:

Update `docker-compose.yml`:
```yaml
environment:
  - FRONTEND_URL=https://yourdomain.com
```

Update frontend `.env`:
```env
VITE_API_URL=https://api.yourdomain.com
```

## Troubleshooting

### Port already in use
If you get a port conflict error:
```bash
# Find what's using the port
sudo lsof -i :4000
sudo lsof -i :80

# Kill the process or change the port in docker-compose.yml
```

### Container won't start
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild from scratch
docker-compose down -v
docker-compose up --build
```

### Database connection issues
- Verify MongoDB URI is correct
- Check if MongoDB allows connections from Docker containers
- Ensure network connectivity

### Frontend can't connect to backend
- Verify VITE_API_URL in frontend .env
- Check if backend is running: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`

## Health Checks

Both services include health checks:
- Backend: Checks if the API is responding on port 4000
- Frontend: Checks if Nginx is serving content on port 80

View health status:
```bash
docker-compose ps
```

## Scaling

To run multiple instances of a service:
```bash
docker-compose up -d --scale backend=3
```

Note: You'll need a load balancer for this to work properly.

## Security Best Practices

1. Never commit `.env` files to version control
2. Use Docker secrets for sensitive data in production
3. Run containers as non-root users
4. Keep Docker images updated
5. Scan images for vulnerabilities: `docker scan <image-name>`
6. Use specific version tags instead of `latest`
7. Limit container resources (CPU, memory)

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Docker Guide](https://docs.nestjs.com/recipes/docker)
- [Vite Docker Guide](https://vitejs.dev/guide/static-deploy.html)
