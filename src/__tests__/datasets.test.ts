import { describe, it, expect } from 'vitest';
import datasetData from '../data/datasets.json';

interface DatasetField {
  name: string;
  description: string;
}

interface DroppedField {
  name: string;
  reason: string;
}

interface DatasetDetail {
  id: string;
  title: string;
  source: string;
  downloadUrl: string;
  description: string;
  dataDescription: string[];
  fields: DatasetField[];
  droppedFields?: DroppedField[];
}

const datasets: DatasetDetail[] = datasetData.datasets;

describe('datasets.json schema', () => {
  it('should have at least one dataset', () => {
    expect(datasets.length).toBeGreaterThan(0);
  });

  it('should have a valid allDatasetsDownloadUrl', () => {
    expect(datasetData.allDatasetsDownloadUrl).toMatch(/^https:\/\//);
  });

  it('should have unique dataset IDs', () => {
    const ids = datasets.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should have unique dataset titles', () => {
    const titles = datasets.map((d) => d.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it.each(datasetData.datasets.map((d) => [d.id, d]))(
    'dataset "%s" has all required fields',
    (_id, dataset) => {
      const d = dataset as DatasetDetail;
      expect(d.id).toBeTruthy();
      expect(d.title).toBeTruthy();
      expect(d.source).toMatch(/^https:\/\//);
      expect(d.downloadUrl).toMatch(/^https:\/\//);
      expect(d.description).toBeTruthy();
      expect(d.dataDescription.length).toBeGreaterThan(0);
      expect(d.fields.length).toBeGreaterThan(0);
    },
  );

  it.each(datasetData.datasets.map((d) => [d.id, d]))(
    'dataset "%s" has valid field definitions',
    (_id, dataset) => {
      const d = dataset as DatasetDetail;
      for (const field of d.fields) {
        expect(field.name).toBeTruthy();
        expect(field.description).toBeTruthy();
      }
      if (d.droppedFields) {
        for (const field of d.droppedFields) {
          expect(field.name).toBeTruthy();
          expect(field.reason).toBeTruthy();
        }
      }
    },
  );

  it.each(datasetData.datasets.map((d) => [d.id, d]))(
    'dataset "%s" has no duplicate field names',
    (_id, dataset) => {
      const d = dataset as DatasetDetail;
      const fieldNames = d.fields.map((f) => f.name);
      expect(new Set(fieldNames).size).toBe(fieldNames.length);
    },
  );
});
