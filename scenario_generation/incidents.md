# Incident Corpus (entry-level, scoped)

A curated set of **small-surface, single-root-cause** production incidents suitable
for evaluating **entry-level** candidates. Each incident is intentionally scoped:
one failing system, a short diagnostic path, a handful of signals (including a few
red herrings), and one clear root cause.

These are summarized/scoped from real public postmortems. Sources:
- https://postmortems.app/ (index, builds on danluu/post-mortems)
- https://github.com/danluu/post-mortems
- https://github.com/rnzor/awesome-tech-failures

## Schema (for the downstream evidence-tag-score agent)

Each incident below uses this shape:

```yaml
id: INC-XXX
title: short title
source: url
scope: one-line why this is narrow / entry-level
brief: candidate-facing situation (ambiguous, no root cause given)
facts:          # observable signals; some are on-path, some red herrings
  - text: ...
    tags: [hashtag, ...]
root_cause: the single underlying cause (NOT shown to candidate)
resolution: how it was fixed / mitigated
```

The agent will later consume `facts` (evidence + tags) and produce the recursive
`evidence-tag-score` rubric per incident.

---

## INC-001: Expired TLS certificate
- source: https://postmortems.app/ (cert-expiry class; e.g. MS Teams 2020-02-03)
- scope: single expired artifact, no code change, very short diagnostic path
- brief: |
    Users suddenly cannot log in to the web app this morning; the page shows a
    security warning and API calls fail. Nothing was deployed overnight. You're
    on call — figure out what's happening.
- facts:
    - text: Browser shows "NET::ERR_CERT_DATE_INVALID".
      tags: [tls, certificate, browser]
    - text: No application deploy in the last 48 hours.
      tags: [deployment, change, red-herring]
    - text: Server CPU, memory, and error logs look normal.
      tags: [cpu, memory, red-herring]
    - text: The certificate's "Not After" date is yesterday.
      tags: [tls, certificate, expiry]
    - text: Auto-renewal cron job last succeeded 89 days ago.
      tags: [automation, renewal, cron]
- root_cause: The TLS certificate expired because the auto-renewal job silently failed.
- resolution: Reissue/renew the certificate; fix and alert on the renewal job.

---

## INC-002: Cache hit rate collapse after client upgrade
- source: https://github.com/danluu/post-mortems (caching/deploy class)
- scope: one cache layer, one recent change, clear correlation
- brief: |
    p99 latency on the product API tripled in the last 20 minutes and the site
    feels slow. A deploy went out this morning. You're on call.
- facts:
    - text: Cache hit rate dropped from 95% to 12% around the incident start.
      tags: [cache, redis, performance]
    - text: CPU utilization is normal.
      tags: [cpu, machine, infrastructure, red-herring]
    - text: Disk utilization is normal.
      tags: [disk, infrastructure, red-herring]
    - text: The Redis client library was upgraded in the morning deploy.
      tags: [deployment, redis, change]
    - text: New client uses a different default key serialization.
      tags: [redis, serialization, config]
- root_cause: The upgraded Redis client changed key serialization, so old keys never matched — every read missed.
- resolution: Roll back the client (or pin serialization); warm the cache.

---

## INC-003: Database connection pool exhaustion
- source: https://postmortems.app/ (connection-pool class)
- scope: one service, one resource limit, reproducible under load
- brief: |
    A backend service starts returning 500s during the daily traffic peak. It
    recovers on its own at night and breaks again the next peak. Find out why.
- facts:
    - text: Errors are "timeout acquiring connection from pool".
      tags: [database, connection-pool, timeout]
    - text: Database CPU and query latency are normal.
      tags: [database, cpu, red-herring]
    - text: Pool max size is 10; service runs 8 replicas.
      tags: [connection-pool, config, scaling]
    - text: A new endpoint opens a connection but only releases it in the success path.
      tags: [code, leak, connection]
    - text: Errors spike exactly when request volume is highest.
      tags: [load, correlation, performance]
- root_cause: A connection leak on the error path drained the pool under peak load.
- resolution: Release connections in a finally block; raise pool size as a stopgap.

---

## INC-004: Bad config change causes brief outage
- source: https://github.com/blog (GitHub 2024-08-14 db config change, 36-min outage)
- scope: single config change, immediate blast radius, fast rollback
- brief: |
    Right after a routine configuration change, the main app returns errors for
    most users. No application code was shipped. You have the change log.
- facts:
    - text: Outage started within a minute of a configuration change being applied.
      tags: [config, change, correlation]
    - text: No application code was deployed.
      tags: [deployment, code, red-herring]
    - text: The change pointed the app at a database that couldn't serve the load.
      tags: [database, config, capacity]
    - text: Error rate dropped to zero immediately after rolling the change back.
      tags: [rollback, recovery, config]
- root_cause: A configuration change routed traffic to an under-provisioned database.
- resolution: Roll back the config; add validation/canary for config changes.

---

## INC-005: Disk full from unrotated logs
- source: https://github.com/danluu/post-mortems (disk-full class)
- scope: single host, single resource, gradual then sudden failure
- brief: |
    One service instance starts failing to write data and throwing errors, while
    its siblings are fine. It began failing a few hours ago. Diagnose it.
- facts:
    - text: Errors are "No space left on device".
      tags: [disk, filesystem, error]
    - text: CPU and memory on the host are normal.
      tags: [cpu, memory, red-herring]
    - text: Only one instance is affected; others are healthy.
      tags: [host, scope, isolation]
    - text: A debug log was left at verbose level after last week's investigation.
      tags: [logging, config, change]
    - text: Log rotation is not configured for that log file.
      tags: [logrotate, config, ops]
- root_cause: Verbose logging filled the disk because that log was never rotated.
- resolution: Truncate/rotate logs, lower log level, configure rotation + disk alerts.

---

## INC-006: Bad regex in a rule spikes CPU
- source: https://blog.cloudflare.com (Cloudflare 2019-07-02 WAF regex)
- scope: one rule change, one symptom (CPU), single clear trigger
- brief: |
    Moments after a new rule was pushed, servers across the fleet hit ~100% CPU
    and requests stall. The rule was a "low-risk" change. Work out the cause.
- facts:
    - text: CPU jumped to ~100% across many servers at the same moment.
      tags: [cpu, performance, fleet-wide]
    - text: The spike lines up exactly with a new rule deployment.
      tags: [deployment, change, correlation]
    - text: Memory and disk are normal.
      tags: [memory, disk, red-herring]
    - text: The new rule contained a regex with catastrophic backtracking.
      tags: [regex, code, performance]
    - text: Reverting the rule returned CPU to baseline.
      tags: [rollback, recovery]
- root_cause: A regex with catastrophic backtracking consumed CPU on every request.
- resolution: Roll back the rule; add regex complexity limits and staged rollout.
