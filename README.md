# LinkSnip - URL Shortener

A high-performance URL shortening service built with Go, featuring real-time analytics, rate limiting, and containerized deployment with Docker.

## 🚀 Features

- **URL Shortening**: Convert long URLs into short, shareable links
- **Custom Short URLs**: Create personalized short links for branding
- **Expiry Management**: Set time-based expiration for links (configurable in hours)
- **Rate Limiting**: API quota per IP address to prevent abuse (30-minute rolling window)
- **URL Validation**: Validates URLs and enforces HTTPS/SSL
- **URL Redirection**: Permanent 301 redirects to original URLs
- **Click Tracking**: Track the number of times each shortened URL is accessed
- **Analytics Dashboard**: Beautiful UI to monitor your shortened links
- **CORS Support**: Cross-Origin Resource Sharing enabled for frontend integration
- **Environment Configuration**: Easy configuration via `.env` file
- **Domain Error Handling**: Server validates domain availability

## 🛠️ Tech Stack

### Backend
- **Go 1.25** - Backend runtime
- **Fiber v2.52** - High-performance web framework
- **Redis** - In-memory data store for fast URL lookups and rate limiting
- **UUID** - For generating unique short codes
- **govalidator** - URL validation library
- **godotenv** - Environment variable management

### Frontend
- **HTML5** - Structure
- **CSS3** - Modern styling with animations
- **JavaScript (Vanilla)** - Interactive form handling and API calls
- **Google Fonts** - Beautiful typography

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Redis Docker Image** - Official Redis container

## 📋 Prerequisites

- Go 1.25 or higher
- Docker & Docker Compose
- curl or Postman (for API testing)

## 🚀 Installation & Setup

### Option 1: Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd Email_shortener
```

2. Run with Docker Compose:
```bash
docker-compose up -d
```

The application will be available at `http://localhost:3000`

### Option 2: Local Development

1. Install dependencies:
```bash
cd API
go mod download
```

2. Create `.env` file in the API directory:
```env
APP_PORT=:3000
REDIS_PORT=:6379
REDIS_HOST=localhost
API_QUOTA=10
```

3. Start Redis on your machine

4. Run the application:
```bash
go run main.go
```

## 📡 API Endpoints

### 1. Shorten URL
**POST** `/api/v1`

Request body:
```json
{
  "url": "https://example.com/very/long/url",
  "short": "my-link",
  "expiry": 24
}
```

Response:
```json
{
  "url": "https://example.com/very/long/url",
  "short": "my-link",
  "expiry": 24,
  "rate_limit": 9,
  "rate_limit_reset": 1234
}
```

**Status Codes:**
- `200 OK` - Successfully shortened
- `400 Bad Request` - Invalid URL or JSON
- `403 Forbidden` - Custom short already in use
- `429 Too Many Requests` - Rate limit exceeded
- `503 Service Unavailable` - Server error

### 2. Resolve URL
**GET** `/:short`

Redirects to the original URL with a 301 permanent redirect.

**Status Codes:**
- `301 Moved Permanently` - Successful redirect
- `404 Not Found` - Short URL not found
- `500 Internal Server Error` - Database connection issue

## 🌐 Web Interface

Access the interactive UI at `http://localhost:3000`

Features:
- Paste long URLs
- Optionally create custom short URLs
- Set link expiration time (in hours)
- Copy shortened URL with one click
- View click statistics
- Real-time feedback and validation

## 📁 Project Structure

```
Email_shortener/
├── API/
│   ├── main.go              # Application entry point
│   ├── go.mod              # Go dependencies
│   ├── .env                # Environment variables
│   ├── Dockerfile          # Docker configuration
│   ├── database/
│   │   └── database.go     # Redis connection setup
│   ├── Helper/
│   │   └── helper.go       # URL validation & utilities
│   └── Routes/
│       ├── shorten.go      # URL shortening logic
│       └── resolve.go      # URL resolution logic
├── UI/
│   ├── index.html          # Main interface
│   ├── styles.css          # Styling
│   └── script.js           # Frontend logic
├── db/
│   └── Dockerfile          # Redis Docker configuration
├── Docker-compose.yml      # Multi-container setup
└── README.md              # This file
```

## 🔧 Configuration

Edit the `.env` file to customize:

```env
APP_PORT=:3000              # API server port
REDIS_PORT=:6379           # Redis port
REDIS_HOST=localhost       # Redis host
API_QUOTA=10              # Requests per rolling window
```

## 🐳 Docker Deployment

### Build Images

```bash
docker-compose build
```

### Start Services

```bash
docker-compose up -d
```

### View Logs

```bash
docker-compose logs -f api
docker-compose logs -f db
```

### Stop Services

```bash
docker-compose down
```

### Remove All Data

```bash
docker-compose down -v
```

## 💡 Usage Examples

### Create a Shortened URL

```bash
curl -X POST http://localhost:3000/api/v1 \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://google.com",
    "short": "goog",
    "expiry": 24
  }'
```

### Auto-Generated Short Code

```bash
curl -X POST http://localhost:3000/api/v1 \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://github.com/some/long/repository",
    "expiry": 48
  }'
```

### Redirect to Original URL

```bash
curl -L http://localhost:3000/goog
```

## 🔐 Security Features

- **HTTPS Enforcement**: All URLs are converted to HTTPS
- **URL Validation**: Only valid URLs are accepted
- **Rate Limiting**: 10 requests per IP per 30 minutes (configurable)
- **Domain Validation**: Server checks domain availability
- **CORS Configuration**: Controlled cross-origin access
- **Expiry Protection**: Links automatically expire after set time

## 📊 Rate Limiting

- Rate limit is applied per IP address
- Default: 10 requests per 30-minute window
- When exceeded, returns HTTP 429 with remaining time until reset
- Configure via `API_QUOTA` environment variable

## 🚦 Response Headers

All responses include:
- `X-RateLimit-Remaining` - Requests remaining in current window
- `X-RateLimit-Reset` - Seconds until rate limit resets

## 🐛 Troubleshooting

### Container won't start
```bash
docker-compose logs api
docker-compose logs db
```

### Redis connection refused
- Ensure Redis container is running: `docker-compose ps`
- Check Redis port: `REDIS_PORT=6379`

### Rate limit issues
- Clear rate limit data from Redis: `redis-cli FLUSHDB`
- Adjust `API_QUOTA` in `.env`

### Invalid URL error
- Ensure URL starts with `http://` or `https://`
- Check domain is accessible

## 📈 Performance

- **Response Time**: < 10ms for URL resolution
- **Throughput**: Handles thousands of redirects/second
- **Concurrency**: Efficiently handles multiple concurrent requests
- **Storage**: Redis in-memory storage for instant access

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Pankaj Gupta**

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests.

## 📞 Support

For issues or questions, please open an issue on the repository.

---

Made with ❤️ using Go and Redis
