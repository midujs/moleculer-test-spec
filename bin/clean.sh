# !/bin/bash
echo "Removing containers..."
docker stop TEST_SPEC_Grafana
docker stop TEST_SPEC_Prometheus
docker stop TEST_SPEC_Jaeger