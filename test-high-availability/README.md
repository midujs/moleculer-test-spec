# Test High Availability

## Cases

### API Gateway route between different "debug" services

Due to "retry", "heartbeat", "timeout"

Does unavailable service's instance, cause HA reduce rate?

Example:
- Call 200 requests, through 120s
- Killing one `debug` service's instance
- Count HA of API Gateway: does killing & retry -> service not available

```bash
# Load 1
artillery quick \
  --rate 5 \
  --num 2 \
  --duration 15 \
  http://localhost:3000/api/debug

# Load 2
artillery quick \
  --rate 5 \
  --num 200 \
  --duration 3 \
  http://localhost:3000/api/debug
```