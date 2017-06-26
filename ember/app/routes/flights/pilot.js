import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),

  model({pilot_id}) {
    return this.get('ajax').request(`/flights/pilot/${pilot_id}`);
  },
});