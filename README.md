# Notes

## Try default metrics

### Prerequisite

- Install modules

```sh
yarn
yarn setup // Run lerna bootstrap
```

- Run default metric

```sh
# In side packages, we have 4 default metrics
# Run each one by calling
yarn dev [metric-folder] [example-name]

# Run console metric
yarn dev moleculer-console-tracer simple
```

### Zipkin

Steps to run demo

- Run zipkin as docker

```sh
docker run --rm --detach --publish 9411:9411 openzipkin/zipkin
```

- Update zipkin's url to tell moleculer where to send event

```sh
# Update ZIPKIN_URL in env
export ZIPKIN_URL=http://192.168.1.6:9411
```

### Prometheus

Setup to run demo

- Run Prometheus, Grafana as docker

```sh
# Update prometheus.yml before run

    static_configs:
      - targets:
          - 10.0.0.106:3030 <- this one

docker run --rm --detach --publish 9090:9090 -v $PWD/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus:v2.7.1

# Grafana, default admin/admin
docker run --rm --detach --publish 3001:3000 grafana/grafana:5.3.4

# At Grafana dashboard, add new Data Source
Dashboard: http://localhost:3001
Login: admin/admin

Settings > Datasource
- Name: Prometheus
- Type: Prometheus
# Please use IP, not "localhost". In docker, "localhost" binding to itself
- IP: 192.168.1.10:9090
- Save

# At Grafana dashboard, add new Dashboard
# Try to import "Json Model" for Prometheus (different version, different UI)
(+)(New Dashboard)
- Click to "Json Model"
- Copy file json in source (replace ${DS_DATASOURCE} with "Prometheus")
- Click save
- Drag modules on dashboard to review

# For Grafana 5x
(+)(Import default dashboard)
- Click to Dashboard tab, next to Datasource
- Import "Prometheus Stats..."
- Go to dashboard
- Click "Settings" icon
- Choose "Json Model"
- Paste json file in source
- Save
```

### Jaeger

- Setup jaeger

```sh
docker run --rm --detach --name jaeger \
  -e COLLECTOR_ZIPKIN_HTTP_PORT=9411 \
  --publish 5775:5775/udp \
  --publish 6831:6831/udp \
  --publish 6832:6832/udp \
  --publish 5778:5778 \
  --publish 16686:16686 \
  --publish 14268:14268 \
  --publish 9411:9411 \
  jaegertracing/all-in-one:1.9
```

- Run demo

```sh
yarn demo moleculer-jaeger
```

- Review

```sh
http://localhost:16686
```
