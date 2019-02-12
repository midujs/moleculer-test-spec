# !/bin/bash
echo "Starting setup docker..."
echo "Please update 'prometheus/prometheus.yml' config" && sleep 3
docker run --name TEST_SPEC_Grafana --rm --detach --publish 3001:3000 grafana/grafana:5.3.4
(cd prometheus && docker run --name TEST_SPEC_Prometheus --rm --detach --publish 9090:9090 -v $PWD/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus:v2.7.1)
docker run --name TEST_SPEC_Jaeger --rm --detach \
  -e COLLECTOR_ZIPKIN_HTTP_PORT=9411 \
  --publish 5775:5775/udp \
  --publish 6831:6831/udp \
  --publish 6832:6832/udp \
  --publish 5778:5778 \
  --publish 16686:16686 \
  --publish 14268:14268 \
  --publish 9411:9411 \
  jaegertracing/all-in-one:1.9