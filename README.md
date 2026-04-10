# Smart Resource Management System

Production-grade microservices-based resource management system with complete DevOps pipeline.

## Architecture

```
Frontend (React) → API Gateway → Microservices → PostgreSQL Database
                    ├── User Service
                    ├── Resource Service
                    └── Booking Service
```

## Services

- **Frontend**: React application on port 3000
- **API Gateway**: Express proxy on port 5000
- **User Service**: User management on port 5001
- **Resource Service**: Resource management on port 5002
- **Booking Service**: Booking management on port 5003
- **PostgreSQL**: Database on port 5432 ....

## Quick Start with Docker Compose

```bash
# Clone repository
cd /media/zorin-victus/3A5417DF54179D27/DevOps_Project

# Start all services
docker-compose up -d

# Verify services
curl http://localhost:5000/health
curl http://localhost:5001/health
curl http://localhost:5002/health
curl http://localhost:5003/health
```

Visit `http://localhost:3000` to access the frontend.

## Database

Default credentials:
- User: `postgres`
- Password: `postgres`
- Database: `smart_resource_db`

Schema includes:
- `users` table
- `resources` table
- `bookings` table

## API Endpoints

### Users
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Resources
- `GET /api/resources` - List all resources
- `GET /api/resources/:id` - Get resource by ID
- `POST /api/resources` - Create resource
- `PUT /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource

### Bookings
- `GET /api/bookings` - List all bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

## DevOps

### Local Development
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Kubernetes Deployment
```bash
# Apply configurations
kubectl apply -f devops/kubernetes/postgres.yaml
kubectl apply -f devops/kubernetes/services.yaml
kubectl apply -f devops/kubernetes/gateway-frontend.yaml

# Check deployments
kubectl get deployments -n smart-resource
kubectl get services -n smart-resource
```

### Terraform Infrastructure
```bash
cd devops/terraform

# Initialize
terraform init

# Plan
terraform plan

# Apply
terraform apply

# Get outputs
terraform output
```

### Ansible Configuration
```bash
# Configure servers
ansible-playbook -i devops/ansible/inventory.ini devops/ansible/playbook.yml
```

### GitHub Actions CI/CD
Push to `main` or `develop` branches to trigger:
1. Build and test
2. Lint code
3. Build Docker images

## Environment Variables

Each service requires `.env` file. Example files are provided as `.env.example`.

Frontend:
- `REACT_APP_API_URL` - API Gateway URL

API Gateway:
- `PORT` - Server port
- `USER_SERVICE_URL` - User service URL
- `RESOURCE_SERVICE_URL` - Resource service URL
- `BOOKING_SERVICE_URL` - Booking service URL

Services:
- `PORT` - Server port
- `DB_USER` - PostgreSQL user
- `DB_PASSWORD` - PostgreSQL password
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_NAME` - Database name

## Directory Structure

```
DevOps_Project/
├── services/
│   ├── frontend/          # React application
│   ├── api-gateway/       # Express gateway
│   ├── user-service/      # User microservice
│   ├── resource-service/  # Resource microservice
│   └── booking-service/   # Booking microservice
├── devops/
│   ├── docker/            # Docker configurations
│   ├── kubernetes/        # K8s manifests
│   ├── terraform/         # Infrastructure as Code
│   ├── ansible/           # Configuration management
│   └── github-actions/    # CI/CD workflows
├── database/              # Database initialization
└── docker-compose.yml     # Local orchestration
```

## Health Checks

All services expose `/health` endpoint:
- API Gateway: `http://localhost:5000/health`
- User Service: `http://localhost:5001/health`
- Resource Service: `http://localhost:5002/health`
- Booking Service: `http://localhost:5003/health`

## Production Deployment

1. Set environment variables in `.env` files
2. Build Docker images: `docker build -t service-name:latest ./services/service-name`
3. Push to registry: `docker push registry/service-name:latest`
4. Deploy with Kubernetes or docker-compose
5. Configure Terraform for infrastructure
6. Use Ansible for server provisioning

## Monitoring and Logging

- Docker: `docker-compose logs -f service-name`
- Kubernetes: `kubectl logs -f deployment/service-name -n smart-resource`
- Health checks every 30 seconds
- Startup delay: 5-30 seconds depending on service

## License

MIT
