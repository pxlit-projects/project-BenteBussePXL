# CompanyPulse System Architecture

## Overview
CompanyPulse is a microservices-based content management system that enables content creation, review, and interaction through a modern distributed architecture.

## User Roles
### Reader
- Views published posts
- Filters content
- Places comments on posts
- Reads comments from other users

### Editor
- Creates new posts
- Saves posts as concepts
- Edits post content
- Reviews and moderates submitted posts

## Core Components

### Frontend Layer
#### Single Page Application
- Built with Angular
- Container-based deployment
- Provides unified interface for all user interactions
- Communicates with backend through API Gateway

### API Layer
#### API Gateway
- Implemented using Spring Cloud Gateway
- Acts as central entry point for all client requests
- Routes requests to appropriate microservices
- Integrates with service discovery

#### Discovery Service
- Built with Eureka
- Handles service registration
- Enables dynamic service discovery
- Maintains service registry

### Microservices

#### PostService Application
- Core content management service
- Handles post creation and storage
- Container: Spring Boot Java
- Maintains dedicated database
- Publishes events to Event Bus

#### ReviewService
- Manages content review workflow
- Container: Spring Boot Java
- Stores review-related data
- Processes content approval flows

#### CommentService Application
- Handles user comment functionality
- Container: Spring Boot Java
- Maintains separate comment database
- Integrates with Event Bus for notifications

#### Config Service
- Manages application configuration
- Container: Spring Boot Config
- Delivers configuration to all services
- Centralizes configuration management

### Message Broker
#### Event Bus
- Implemented using RabbitMQ
- Enables asynchronous inter-service communication
- Handles event distribution
- Maintains message queues

## Communication Patterns
- **Synchronous**: Direct REST API calls (solid lines)
- **Asynchronous**: Event-driven messaging (dotted lines)
- **Service Discovery**: Dynamic service registration and discovery

## Data Management
- Each microservice maintains its own database
- Ensures data independence
- Enables service autonomy
- Follows database-per-service pattern

## Technology Stack
- Frontend: Angular
- API Gateway: Spring Cloud Gateway
- Service Discovery: Eureka
- Microservices: Spring Boot Java
- Message Broker: RabbitMQ
- Configuration: Spring Cloud Config


![C4ModelJavaProject drawio](https://github.com/user-attachments/assets/42821c65-b756-455d-946d-3bb563834a52)


