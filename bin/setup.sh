# !/bin/bash
echo "Starting setup docker..."
echo "Please update HOST_IP in 'prometheus/prometheus.yml':
  - scrape_configs > static_configs > targets" && sleep 3

GRAFANA=TEST_SPEC_Grafana
PROMETHEUS=TEST_SPEC_Prometheus
JAEGER=TEST_SPEC_Jaeger

### Start Grafana
docker run \
  --rm \
  --detach \
  --name ${GRAFANA} \
  --publish 3001:3000 \
  --volume grafana-storage:/var/lib/grafana \
  grafana/grafana:5.3.4

### Start Prometheus
(cd prometheus && \
docker run \
  --rm \
  --detach \
  --publish 9090:9090 \
  --name ${PROMETHEUS} \
  -v $PWD/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus:v2.7.1)

### Start Jaeger
docker run \
  --rm \
  --detach \
  --name ${JAEGER} \
  -e COLLECTOR_ZIPKIN_HTTP_PORT=9411 \
  --publish 5775:5775/udp \
  --publish 6831:6831/udp \
  --publish 6832:6832/udp \
  --publish 5778:5778 \
  --publish 16686:16686 \
  --publish 14268:14268 \
  --publish 9411:9411 \
  jaegertracing/all-in-one:1.9