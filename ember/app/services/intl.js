import Ember from 'ember';
import IntlService from 'ember-intl/services/intl';

export default IntlService.extend({
  ajax: Ember.inject.service(),
  cookies: Ember.inject.service(),

  async loadAndSetLocale(locale) {
    await this.loadLocale(locale);
    this.setLocale(locale);
  },

  async loadLocale(locale) {
    if (this.exists('yes', locale)) {
      return;
    }

    let translations = await this.get('ajax').request(`/translations/${locale}.json`);
    await this.addTranslations(locale, translations);
  },

  setLocale(locale) {
    Ember.debug(`Setting locale to "${locale}"`);
    this._super(...arguments);
    this.get('cookies').write('locale', locale, { path: '/', expires: new Date('2099-12-31') });

    document.documentElement.lang = locale;
  },
});
