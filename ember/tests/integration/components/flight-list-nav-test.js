import Ember from 'ember';

import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import { findAll } from 'ember-native-dom-helpers';

import instanceInitializer from 'skylines/instance-initializers/ember-intl';

describe('Integration | Component | flight list nav', function() {
  setupComponentTest('flight-list-nav', { integration: true });

  beforeEach(function() {
    instanceInitializer.initialize(this);

    this.register('service:account', Ember.Service.extend({
      user: null,
      club: null,
    }));

    this.register('service:pinned-flights', Ember.Service.extend({
      // eslint-disable-next-line ember/avoid-leaking-state-in-components
      pinned: [],
    }));

    this.inject.service('intl', { as: 'intl' });
    this.inject.service('account', { as: 'account' });
    this.inject.service('pinned-flights', { as: 'pinned' });

    return this.get('intl').loadAndSetLocale('en');
  });

  it('renders default view', function() {
    this.render(hbs`{{flight-list-nav date=date airport=airport club=club pilot=pilot}}`);

    let elements = findAll('li');
    expect(elements).to.have.length(2);
    expect(elements[0].textContent.trim()).to.equal('All');
    expect(elements[1].textContent.trim()).to.equal('Latest');
  });

  it('shows date', function() {
    this.render(hbs`{{flight-list-nav date="2016-06-24"}}`);

    let elements = findAll('li');
    expect(elements).to.have.length(4);
    expect(elements[0].textContent.trim()).to.equal('All');
    expect(elements[1].textContent.trim()).to.equal('');
    expect(elements[2].textContent.trim()).to.match(/0?6\/24\/2016/);
    expect(elements[3].textContent.trim()).to.equal('');
  });

  it('shows date in "latest" mode', function() {
    this.render(hbs`{{flight-list-nav date="2016-06-24" latest=true}}`);

    let elements = findAll('li');
    expect(elements).to.have.length(4);
    expect(elements[0].textContent.trim()).to.equal('All');
    expect(elements[1].textContent.trim()).to.equal('');
    expect(elements[2].textContent.trim()).to.match(/0?6\/24\/2016/);
    expect(elements[3].textContent.trim()).to.equal('');
  });

  it('shows selected airport', function() {
    this.set('airport', { id: 123, name: 'Meiersberg' });

    this.render(hbs`{{flight-list-nav date=date airport=airport club=club pilot=pilot}}`);

    let elements = findAll('li');
    expect(elements).to.have.length(3);
    expect(elements[0].textContent.trim()).to.equal('All');
    expect(elements[1].textContent.trim()).to.equal('Latest');
    expect(elements[2].textContent.trim()).to.equal('Meiersberg');
  });

  it('shows selected club', function() {
    this.set('club', { id: 3, name: 'SFN' });

    this.render(hbs`{{flight-list-nav date=date airport=airport club=club pilot=pilot}}`);

    let elements = findAll('li');
    expect(elements).to.have.length(3);
    expect(elements[0].textContent.trim()).to.equal('All');
    expect(elements[1].textContent.trim()).to.equal('Latest');
    expect(elements[2].textContent.trim()).to.equal('SFN');
  });

  it('shows own club', function() {
    this.set('account.club', { id: 42, name: 'SFZ Aachen' });

    this.render(hbs`{{flight-list-nav date=date airport=airport club=club pilot=pilot}}`);

    let elements = findAll('li');
    expect(elements).to.have.length(3);
    expect(elements[0].textContent.trim()).to.equal('All');
    expect(elements[1].textContent.trim()).to.equal('Latest');
    expect(elements[2].textContent.trim()).to.equal('SFZ Aachen');
  });

  it('shows selected club and own club', function() {
    this.set('club', { id: 3, name: 'SFN' });
    this.set('account.club', { id: 42, name: 'SFZ Aachen' });

    this.render(hbs`{{flight-list-nav date=date airport=airport club=club pilot=pilot}}`);

    let elements = findAll('li');
    expect(elements).to.have.length(4);
    expect(elements[0].textContent.trim()).to.equal('All');
    expect(elements[1].textContent.trim()).to.equal('Latest');
    expect(elements[2].textContent.trim()).to.equal('SFN');
    expect(elements[3].textContent.trim()).to.equal('SFZ Aachen');
  });

  it('shows club just once if selected club equals own club', function() {
    this.set('club', { id: 42, name: 'SFZ Aachen' });
    this.set('account.club', { id: 42, name: 'SFZ Aachen' });

    this.render(hbs`{{flight-list-nav date=date airport=airport club=club pilot=pilot}}`);

    let elements = findAll('li');
    expect(elements).to.have.length(3);
    expect(elements[0].textContent.trim()).to.equal('All');
    expect(elements[1].textContent.trim()).to.equal('Latest');
    expect(elements[2].textContent.trim()).to.equal('SFZ Aachen');
  });

  it('shows selected pilot', function() {
    this.set('pilot', { id: 5, name: 'foobar' });

    this.render(hbs`{{flight-list-nav date=date airport=airport club=club pilot=pilot}}`);

    let elements = findAll('li');
    expect(elements).to.have.length(3);
    expect(elements[0].textContent.trim()).to.equal('All');
    expect(elements[1].textContent.trim()).to.equal('Latest');
    expect(elements[2].textContent.trim()).to.equal('foobar');
  });

  it('shows own user (and unassigned flights link)', function() {
    this.set('account.user', { id: 42, name: 'john doe' });

    this.render(hbs`{{flight-list-nav date=date airport=airport club=club pilot=pilot}}`);

    let elements = findAll('li');
    expect(elements).to.have.length(4);
    expect(elements[0].textContent.trim()).to.equal('All');
    expect(elements[1].textContent.trim()).to.equal('Latest');
    expect(elements[2].textContent.trim()).to.equal('john doe');
    expect(elements[3].textContent.trim()).to.equal('Unassigned');
  });

  it('shows selected pilot and own user', function() {
    this.set('pilot', { id: 3, name: 'SFN' });
    this.set('account.user', { id: 42, name: 'john doe' });

    this.render(hbs`{{flight-list-nav date=date airport=airport club=club pilot=pilot}}`);

    let elements = findAll('li');
    expect(elements).to.have.length(5);
    expect(elements[0].textContent.trim()).to.equal('All');
    expect(elements[1].textContent.trim()).to.equal('Latest');
    expect(elements[2].textContent.trim()).to.equal('SFN');
    expect(elements[3].textContent.trim()).to.equal('john doe');
    expect(elements[4].textContent.trim()).to.equal('Unassigned');
  });

  it('shows pilot just once if selected pilot equals own user', function() {
    this.set('pilot', { id: 42, name: 'john doe' });
    this.set('account.user', { id: 42, name: 'john doe' });

    this.render(hbs`{{flight-list-nav date=date airport=airport club=club pilot=pilot}}`);

    let elements = findAll('li');
    expect(elements).to.have.length(4);
    expect(elements[0].textContent.trim()).to.equal('All');
    expect(elements[1].textContent.trim()).to.equal('Latest');
    expect(elements[2].textContent.trim()).to.equal('john doe');
    expect(elements[3].textContent.trim()).to.equal('Unassigned');
  });

  it('shows pinned flights if available', function() {
    this.set('pinned.pinned', [1, 2, 3]);

    this.render(hbs`{{flight-list-nav date=date airport=airport club=club pilot=pilot}}`);

    let elements = findAll('li');
    expect(elements).to.have.length(3);
    expect(elements[0].textContent.trim()).to.equal('All');
    expect(elements[1].textContent.trim()).to.equal('Latest');
    expect(elements[2].textContent.trim()).to.equal('Pinned');
  });
});
