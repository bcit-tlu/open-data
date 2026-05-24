# AGENTS.md — Open Data Portal

## Project overview

Open Data Portal is a Docusaurus-based static site that publishes de-identified
learning analytics datasets from BCIT Brightspace. It builds to static HTML/CSS/JS
served by nginx-unprivileged inside a Kubernetes cluster.

## Tech stack

| Layer       | Technology                       |
|-------------|----------------------------------|
| Framework   | Docusaurus 3 (React, TypeScript) |
| Runtime     | Node.js >= 20                    |
| Container   | nginx-unprivileged (Alpine)      |
| Orchestration | Helm chart + Flux CD (GitOps)  |
| CI/CD       | GitHub Actions, release-please   |
| Registry    | GHCR (OCI images + Helm charts)  |

## Repository layout

```
.
├── charts/              # Helm chart (flat layout, single component)
├── conf.d/              # nginx configuration
├── docs/                # MDX content pages
├── src/
│   ├── css/             # Global CSS (Infima overrides)
│   └── pages/           # React page components
├── static/              # Static assets (images, downloads)
├── .github/workflows/   # CI/CD pipelines
├── Dockerfile           # Multi-stage build (node → nginx)
├── docker-compose.yml   # Local dev environment
├── docusaurus.config.ts # Site configuration
└── release-please-config.json
```

## Build & run

```bash
npm ci                # install dependencies
npm start             # dev server (hot reload)
npm run build         # production build → ./build/
npm run typecheck     # TypeScript type checking
```

## Helm chart

```bash
helm lint charts/
helm template test charts/ | kubeconform -strict -summary \
  -schema-location default -ignore-missing-schemas
```

## Conventions

- **Commits**: Conventional Commits (`feat:`, `fix:`, `ci:`, etc.)
- **PR titles**: Must follow conventional commit format (enforced by CI)
- **Branching**: `devin/<timestamp>-<description>`
- **License**: MPL-2.0
- **Versioning**: Managed by release-please; version tracked via `.release-please-manifest.json` and `# x-release-please-version` annotations in Chart.yaml
- **Helm lint**: `helm lint charts/`
- **Helm validate**: `helm template test charts/ | kubeconform -strict -summary -schema-location default -ignore-missing-schemas`

## CI/CD pipeline

| Workflow            | Trigger              | Purpose                              |
|---------------------|----------------------|--------------------------------------|
| `ci.yaml`           | push/PR to main      | Helm lint + OCI image build          |
| `release-please.yaml` | push to main      | Automated release PR + tag creation  |
| `helm-publish.yaml` | release / dispatch   | Package + sign Helm chart            |
| `release-retag.yaml`| release / dispatch   | Retag image with semver aliases      |
| `pr-title-lint.yaml`| PR to main           | Enforce conventional commit titles   |

## Image tag contract

| Event       | Tags                                         |
|-------------|----------------------------------------------|
| Main push   | `sha-<fullsha>`, `<ver>-rc.<ts>.<short>`     |
| Release     | `<version>`, `latest` (if highest stable)    |
| PR build    | Built but NOT pushed                         |
