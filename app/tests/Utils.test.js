import { formatJobTitle, cleanStateProvince, formatPhoneNumber, convertToTitleCase } from '../utilities/Utils';

describe('testing Utils', () => {
  // External Link test
  test('job title', () => {
    const link = formatJobTitle('An important CEO');
    expect(link).toBe('An Important CEO');
  });

  test('job title', () => {
    const link = formatJobTitle('vice President of sales');
    expect(link).toBe('Vice President of Sales');
  });

  test('job title', () => {
    const link = formatJobTitle('Data analyst');
    expect(link).toBe('Data Analyst');
  });

  test('job title', () => {
    const link = formatJobTitle('Information Technology Manager');
    expect(link).toBe('Information Technology Manager');
  });

  test('job title', () => {
    const link = formatJobTitle('Manager, information technology applic');
    expect(link).toBe('Manager, Information Technology Applic');
  });

  test('job title', () => {
    const link = formatJobTitle('GRA');
    expect(link).toBe('GRA');
  });

  test('job title', () => {
    const link = formatJobTitle('VP Of Sales');
    expect(link).toBe('VP of Sales');
  });

  test('job title', () => {
    const link = formatJobTitle('President, US agency');
    expect(link).toBe('President, US Agency');
  });

  test('job title', () => {
    const link = formatJobTitle('provincial prosecutor Crown Prosecutors JAG');
    expect(link).toBe('Provincial Prosecutor Crown Prosecutors JAG');
  });

  test('state/province', () => {
    const link = cleanStateProvince('US-MO', 'US');
    expect(link).toBe('MO');
  });

  test('state/province', () => {
    const link = cleanStateProvince('Quebec', 'CA');
    expect(link).toBe('Quebec');
  });

  test('state/province', () => {
    const link = cleanStateProvince('MO', 'US');
    expect(link).toBe('MO');
  });

  test('state/province', () => {
    const link = cleanStateProvince('CA-AB', 'CA');
    expect(link).toBe('AB');
  });

  test('state/province', () => {
    const link = cleanStateProvince('CA--AB', 'CA');
    expect(link).toBe('-AB');
  });

  test('state/province', () => {
    const link = cleanStateProvince('-NY', 'US');
    expect(link).toBe('-NY');
  });

  test('state/province', () => {
    const link = cleanStateProvince('NY', 'US');
    expect(link).toBe('NY');
  });

  test('phone formatting', () => {
    const link = formatPhoneNumber('+18001231122');
    expect(link).toBe('+18001231122');
  });

  test('phone formatting', () => {
    const link = formatPhoneNumber('abcdef');
    expect(link).toBe('abcdef');
  });

  test('phone formatting', () => {
    const link = formatPhoneNumber('8001231122');
    expect(link).toBe('8001231122');
  });

  test('phone formatting', () => {
    const link = formatPhoneNumber('1231122');
    expect(link).toBe('1231122');
  });

  test('titleCase', () => {
    const link = convertToTitleCase('NEW YORK');
    expect(link).toBe('New York');
  });

  test('titleCase', () => {
    const link = convertToTitleCase('ALBANY');
    expect(link).toBe('Albany');
  });

  test('titleCase', () => {
    const link = convertToTitleCase('NYC');
    expect(link).toBe('Nyc');
  });

  test('titleCase', () => {
    const link = convertToTitleCase('duluth');
    expect(link).toBe('Duluth');
  });
});

