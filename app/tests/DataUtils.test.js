import { getContactId, mapContactObject } from '../utilities/DataUtils';
import { isExternalLink } from '../utilities/Utils';
import { getAutoCompleteText } from '../utilities/FormUtils';

describe('testing Data Utilities', () => {
  // External Link test
  test('testing if "http://www.ibm.com" is external link', () => {
    const link = isExternalLink('http://www.ibm.com');
    expect(link).toBe(true);
  });
  test('testing if "/pilot" is internal link', () => {
    const link = isExternalLink('/pilot');
    expect(link).toBe(false);
  });
  test('testing if "search?primary=name&name=hari" is internal link', () => {
    const link = isExternalLink('search?primary=name&name=hari');
    expect(link).toBe(false);
  });

  // Get Contact ID from ICI data
  test('testing for empty contact', () => {
    const id = getContactId();
    expect(id).toBe(0);
  });

  test('testing for empty object contact', () => {
    const id = getContactId({});
    expect(id).toBe(0);
  });

  test('testing for empty object contact', () => {
    const id = getContactId({ foo: 1 });
    expect(id).toBe(0);
  });

  test('testing for valid contact id 1234', () => {
    const id = getContactId({ _source: { business_card: { urn_idm_indiv: 1234 } } });
    expect(id).toBe('1234');
  });

  // map contact object
  test('testing contact object lkj', () => {
    const input = {
      _source: {
        business_card: {
          indiv_name_first: 'Alex',
          indiv_name_last: 'Motzenbecker'
        },
        company_profile: {
          dom_comp_name: 'Ogilvy'
        },
        preferences: []
      }
    };
    const output = mapContactObject(input);
    expect(output).toMatchObject({
      autoCompleteText: 'Alex Motzenbecker • Ogilvy', city: '', company: 'Ogilvy', companyURL: null, contactId: 'null', country: '', email: '', firstName: 'Alex', jobTitle: '', lastName: 'Motzenbecker', location: '', original: { _source: { business_card: { indiv_name_first: 'Alex', indiv_name_last: 'Motzenbecker' }, company_profile: { dom_comp_name: 'Ogilvy' }, preferences: [] } }, preferences: [], state: '', type: ''
    });
  });

  // Autocomplete Text
  test('testing for empty autocomplete text kj', () => {
    const text = getAutoCompleteText();
    expect(text).toBe('');
  });

  test('testing for first-name only autocomplete text', () => {
    const text = getAutoCompleteText('alex');
    expect(text).toBe('alex');
  });

  test('testing for last-name only autocomplete text', () => {
    const text = getAutoCompleteText(null, 'motzenbecker');
    expect(text).toBe('motzenbecker');
  });

  test('testing for first/last-names only autocomplete text', () => {
    const text = getAutoCompleteText('alex', 'motzenbecker');
    expect(text).toBe('alex motzenbecker');
  });

  test('testing for first-name and company autocomplete text', () => {
    const text = getAutoCompleteText('alex', null, 'Ogilvy');
    expect(text).toBe('alex • Ogilvy');
  });

  test('testing for first-name and email autocomplete text', () => {
    const text = getAutoCompleteText('alex', null, null, 'alex.motzenbecker@ogilvy.com');
    expect(text).toBe('alex • alex.motzenbecker@ogilvy.com');
  });

  test('testing company only autocomplete text', () => {
    const text = getAutoCompleteText(null, null, 'Ogilvy');
    expect(text).toBe('Ogilvy');
  });

  test('testing company only w/empty strings autocomplete text', () => {
    const text = getAutoCompleteText('', '', 'Ogilvy');
    expect(text).toBe('Ogilvy');
  });

  test('testing for full autocomplete text', () => {
    const text = getAutoCompleteText('alex', 'motzenbecker', 'Ogilvy', 'alex.motzenbecker@ogilvy.com');
    expect(text).toBe('alex motzenbecker • Ogilvy • alex.motzenbecker@ogilvy.com');
  });
});
