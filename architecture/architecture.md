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

## Communication Between Services
**US1**: An editor creates a new post.
- The SPA sends a request to the API gateway
- The API gateway forwards the request to the PostService Application
- The PostService Application saves the new post in the PostService database and publishes a message on the eventbus that a new post has been created.
- The ReviewService Application will catch this messages and create a review request so that another editor can approve or reject the post (async).

**US2**: An editor saves a post as a draft.
- The SPA sends a request to the Gateway
- The Gateway forwadrs the request to the PostService App
- The PostService App saves the draft post in the PostService DB.

**US3**: An editor edits the content of a post.
- The SPA sends a request to the Gateway
- The Gateway forwards the request to the PostService App.
- The PostService App updates the post in the PostService DB and publishes a messages on the eventbus that a post has been edited.
- The ReviewService Application will catch this messages and create a review request for the updated content so another editor can approve or reject the edit (async)

**US4**: A user can see an overview of published posts.
- The SPA sends a request to the Gateway
- The Gateway forwards the request to the PostService App
- The PostService App returns all of the published posts from the PostService DB.

**US5**: A user filters a post based on date.
- The SPA sends a request.
- The Gateway forwards the request
- The PostService App returns only the posts that correspond (between) the date from the PostService DB

**US7**: An editor reviews a post and approves it.
- The SPA sends a request
- The Gateway forwards the request
- The ReviewService App updates the status of the post and publishes a message on the eventbus that the status of the post has changed.
- The PostService App receives the messages and updates the post and saves it to the PostService DB. (async)

**US8**: An editor receives a notification when his/her post is approved or rejected.
- ?

**US9**: An editor adds a comment when rejecting a post.
- The SPA sends a request.
- The gateway forwards the request
- The ReviewService app updates the status of a post and publishes a message on the eventbus that the status of the post has changed with the comment.
- The PostService App receives the message and updates the post and saves it to the PostService DB. (async)
- The CommentService App receives the message and creates a comment on the post and saves it to the CommentService DB. (async)

**US10**: A user comments on a post
- The SPA sends the comment to the Gateway
- The Gateway forwards it to the CommentService App
- The CommentService App saves the comment to the CommentService DB.

**US11**: A user can read comments from other colleagues.
- The SPA sends a request.
- The gateways forwards the request
- The CommentService App retrieves the comments from the commentService DB and sends them back with the post.

**US12**: A user can edits or deletes his/her own comment.
- The SPA sends the edit/delete request.
- The Gateway forwards the request.
- The CommentService App edits or deletes the comment in the CommentService DB.

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


