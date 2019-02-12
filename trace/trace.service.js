const _ = require('lodash');
const Jaeger = require('jaeger-client');
const GuaranteedThroughputSampler = require('jaeger-client/dist/src/samplers/guaranteed_throughput_sampler').default;
const RemoteControlledSampler = require('jaeger-client/dist/src/samplers/remote_sampler').default;
const UDPSender = require('jaeger-client/dist/src/reporters/udp_sender').default;
const Int64 = require('node-int64');

module.exports = {
  name: 'jaeger',

  settings: {
    host: '127.0.0.1',
    port: 6832,
    options: {},

    sampler: {
      type: 'Const',
      options: {},
    },

    // sampler: {
    //   type: 'RateLimiting',
    //   options: {
    //     maxTracesPerSecond: 2,
    //     initBalance: 5,
    //   },
    // },
  },

  events: {
    'metrics.trace.span.finish'(metric) {
      this.makePayload(metric);
    },
  },
  methods: {
    getServiceName(metric) {
      if (metric.service) return metric.service.name ? metric.service.name : metric.service;

      let parts = metric.action.name.split('.');
      parts.pop();
      return parts.join('.');
    },
    getSpanName(metric) {
      if (metric.name) return metric.name;

      if (metric.action) return metric.action.name;
    },
    makePayload(metric) {
      const serviceName = this.getServiceName(metric);
      const tracer = this.getTracer(serviceName);

      let parentCtx;
      if (metric.parent) {
        parentCtx = new Jaeger.SpanContext(
          this.convertID(metric.requestID), // traceId,
          this.convertID(metric.parent), // spanId,
          null, // parentId,
          null, // traceIdStr
          null, // spanIdStr
          null, // parentIdStr
          1, // flags
          {}, // baggage
          '', // debugId
        );
      }

      const span = tracer.startSpan(this.getSpanName(metric), {
        startTime: metric.startTime,
        childOf: parentCtx,
        tags: {
          nodeID: metric.nodeID,
          level: metric.level,
          remoteCall: metric.remoteCall,
        },
      });
      this.addTags(span, 'service', serviceName);
      if (metric.action && metric.action.name) this.addTags(span, 'action', metric.action.name);

      this.addTags(span, Jaeger.opentracing.Tags.SPAN_KIND, Jaeger.opentracing.Tags.SPAN_KIND_RPC_SERVER);

      const sc = span.context();
      sc.traceId = this.convertID(metric.requestID);
      sc.spanId = this.convertID(metric.id);

      if (metric.callerNodeID) this.addTags(span, 'callerNodeID', metric.callerNodeID);

      if (metric.params) this.addTags(span, 'params', metric.params);

      if (metric.meta) this.addTags(span, 'meta', metric.meta);

      if (metric.error) {
        this.addTags(span, Jaeger.opentracing.Tags.ERROR, true);
        this.addTags(span, 'error.message', metric.error.message);
        this.addTags(span, 'error.type', metric.error.type);
        this.addTags(span, 'error.code', metric.error.code);

        if (metric.error.data) this.addTags(span, 'error.data', metric.error.data);

        if (metric.error.stack) this.addTags(span, 'error.stack', metric.error.stack.toString());
      }

      span.finish(metric.endTime);
    },
    addTags(span, key, value, prefix) {
      const name = prefix ? `${prefix}.${key}` : key;
      if (typeof value == 'object') {
        Object.keys(value).forEach(k => this.addTags(span, k, value[k], name));
      } else {
        span.setTag(name, value);
      }
    },
    convertID(id) {
      if (id) {
        return new Int64(id.replace(/-/g, '').substring(0, 16)).toBuffer();
      }
      return null;
    },
    getSampler(serviceName) {
      if (_.isFunction(this.settings.sampler)) return this.settings.sampler;

      if (this.settings.sampler.type == 'RateLimiting')
        return new Jaeger.RateLimitingSampler(
          this.settings.sampler.options.maxTracesPerSecond,
          this.settings.sampler.options.initBalance,
        );

      if (this.settings.sampler.type == 'Probabilistic')
        return new Jaeger.ProbabilisticSampler(this.settings.sampler.options.samplingRate);

      if (this.settings.sampler.type == 'GuaranteedThroughput')
        return new GuaranteedThroughputSampler(
          this.settings.sampler.options.lowerBound,
          this.settings.sampler.options.samplingRate,
        );

      if (this.settings.sampler.type == 'RemoteControlled')
        return new RemoteControlledSampler(serviceName, this.settings.sampler.options);

      return new Jaeger.ConstSampler(
        this.settings.sampler.options && this.settings.sampler.options.decision != null
          ? this.settings.sampler.options.decision
          : 1,
      );
    },
    getReporter() {
      return new Jaeger.RemoteReporter(new UDPSender({ host: this.settings.host, port: this.settings.port }));
    },
    getTracer(serviceName) {
      if (this.tracers[serviceName]) return this.tracers[serviceName];

      const sampler = this.getSampler();
      const reporter = this.getReporter();

      const tracer = new Jaeger.Tracer(serviceName, reporter, sampler, this.settings.options);
      this.tracers[serviceName] = tracer;

      return tracer;
    },
  },
  created() {
    this.tracers = {};
  },
  started() {},
  stopped() {
    Object.keys(this.tracers).forEach(service => {
      this.tracers[service].close();
    });
    this.tracers = {};
  },
};
