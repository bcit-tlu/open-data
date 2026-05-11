import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import datasetData from '../data/datasets.json';

type DatasetField = {
  name: string;
  description: string;
};

type DroppedField = {
  name: string;
  reason: string;
};

type DatasetDetail = {
  id: string;
  title: string;
  source: string;
  downloadUrl: string;
  description: string;
  dataDescription: string[];
  fields: DatasetField[];
  droppedFields?: DroppedField[];
};

const datasetDetails: DatasetDetail[] = datasetData.datasets;
const allDatasetsDownloadUrl: string = datasetData.allDatasetsDownloadUrl;

export function PortalContent(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const schemaImageUrl = useBaseUrl('/img/schema.svg');
  return (
    <main>
      <section className="portal-hero">
        <div className="container">
          <p className="portal-eyebrow">BCIT Teaching and Learning Unit</p>
          <Heading as="h1" className="portal-hero__title">
            {siteConfig.title}
          </Heading>
          <p className="portal-hero__subtitle">{siteConfig.tagline}</p>
        </div>
      </section>

      <section id="about" className="portal-section">
        <div className="container">
          <div>
            <Heading as="h2">About</Heading>
            <p>
              This portal will publish an open, privacy-safe version of key
              Brightspace datasets for learning analytics research,
              experimentation, and reporting.
            </p>
            <p>
              The data listed below reflects the deidentified open-data schema.
              Where source fields were removed for privacy, they are listed
              separately with a rationale.
            </p>
          </div>
        </div>
      </section>

      <section id="entity-relation" className="portal-section">
        <div className="container">
          <Heading as="h2">Entity Relation</Heading>
          <p>
            The following entity relationship diagram provides a high-level view
            of how the open-data entities connect to one another.
          </p>
          <div className="portal-schema">
            <img
              className="portal-schema__image"
              src={schemaImageUrl}
              alt="Entity relationship diagram for the open-data schema"
            />
          </div>
        </div>
      </section>

      <section id="datasets" className="portal-section portal-section--alt">
        <div className="container">
          <Heading as="h2">Data sets and data descriptions</Heading>
          <p>
            Each dataset below includes a short description and a practical data
            description summary. The source link points to the official
            Brightspace documentation page used for reference.
          </p>
          <div className="portal-button-row">
            <a
              className="button button--primary"
              href={allDatasetsDownloadUrl}
              target="_blank"
              rel="noopener noreferrer">
              Download Datasets
            </a>
          </div>
          <div className="portal-card-grid portal-card-grid--single">
            {datasetDetails.map((dataset) => (
              <div key={dataset.id} className="portal-card">
                <span id={dataset.id} className="portal-anchor" aria-hidden="true" />
                <Heading as="h3">{dataset.title}</Heading>
                <p>{dataset.description}</p>
                <p className="portal-card__meta">Data description</p>
                <ul>
                  {dataset.dataDescription.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <p className="portal-card__meta">Field descriptions</p>
                <ul>
                  {dataset.fields.map((field) => (
                    <li key={field.name}>
                      <strong>{field.name}:</strong> {field.description}
                    </li>
                  ))}
                </ul>
                {dataset.droppedFields && dataset.droppedFields.length > 0 && (
                  <>
                    <p className="portal-card__meta">
                      Dropped fields (deidentification)
                    </p>
                    <ul>
                      {dataset.droppedFields.map((field) => (
                        <li key={field.name}>
                          <strong>{field.name}:</strong> {field.reason}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <p className="portal-inline-link">
                  <Link to={dataset.source}>Source documentation</Link>
                </p>
                <div className="portal-button-row">
                  <a
                    className="button button--primary button--sm"
                    href={dataset.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer">
                    Download {dataset.title}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
