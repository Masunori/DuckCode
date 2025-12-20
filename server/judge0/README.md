# Judge0 Self-Deployment

This directory contains the Judge0 self-deployment configuration.

## Build Options

### Option 1: Use Pre-built Image (Recommended - Faster)
```yaml
image: judge0/judge0:1.13.1
```

### Option 2: Build from Source (Current Setup)
```yaml
build:
  context: ./judge0
  dockerfile: Dockerfile
```

## Configuration

Edit `judge0.conf` in the parent directory to customize:
- Database credentials
- Redis settings
- Authentication
- Resource limits

## Deploy

```bash
docker-compose up --build -d
```

## Access

- Judge0 API: http://localhost:2358
- Health check: http://localhost:2358/health

## Languages Support

Judge0 supports 60+ languages. Test with:
```bash
curl http://localhost:2358/languages
```
