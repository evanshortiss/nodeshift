'use strict';

const test = require('tape');

const serviceEnricher = require('../../lib/resource-enrichers/service-enricher');

const config = {
  projectName: 'Project Name',
  version: '1.0.0',
  context: {
    namespace: 'the namespace'
  }
};

test('service enricher test - no service', (t) => {
  const resourceList = [];

  t.ok(serviceEnricher.enrich, 'has an enrich property');
  t.equal(typeof serviceEnricher.enrich, 'function', 'is a function');
  t.ok(serviceEnricher.name, 'has an name property');
  t.equal(serviceEnricher.name, 'service', 'name property is service');

  const p = serviceEnricher.enrich(config, resourceList);
  t.ok(p instanceof Promise, 'enricher should return a Promise');

  p.then((se) => {
    t.equal(Array.isArray(se), true, 'should return an array');
    t.equal(resourceList.length, 1, 'resourceList size increases by 1');
    t.ok(se[0].spec.selector, 'selector prop should be here');
    t.equal(se[0].spec.selector.provider, 'nodeshift', 'provider should be nodeshift');
    t.equal(se[0].spec.selector.project, config.projectName, `spec.selector.project should be ${config.projectName}`);
    t.ok(se[0].spec.ports, 'ports prop should be here');
    t.ok(Array.isArray(se[0].spec.ports), 'ports prop should be here');
    t.ok(se[0].spec.type, 'type prop should be here');
    t.equal(se[0].spec.type, 'ClusterIP', 'spec.type should be ClusterIP');
    t.end();
  });
});

test('service enricher test - no service', async (t) => {
  const resourceList = [
    {
      kind: 'Service',
      spec: {
        ports: [
          {
            protocol: 'TCP',
            port: 8080,
            targetPort: 8080
          }
        ]
      }
    },
    { kind: 'Deployment' }
  ];
  const se = await serviceEnricher.enrich(config, resourceList);

  t.notEqual(se, resourceList, 'arrays should not be equal');
  t.equal(Array.isArray(se), true, 'should return an array');
  t.equal(resourceList.length, 2, 'resourceList size should not increases by 2');
  t.ok(se[0].spec.selector, 'selector prop should be here');
  t.equal(se[0].spec.selector.provider, 'nodeshift', 'provider should be nodeshift');
  t.equal(se[0].spec.selector.project, config.projectName, `spec.selector.project should be ${config.projectName}`);
  t.ok(se[0].spec.ports, 'ports prop should be here');
  t.ok(Array.isArray(se[0].spec.ports), 'ports prop should be here');
  t.ok(se[0].spec.type, 'type prop should be here');
  t.equal(se[0].spec.type, 'ClusterIP', 'spec.type should be ClusterIP');
  t.end();
});
