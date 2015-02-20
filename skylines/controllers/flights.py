# -*- coding: utf-8 -*-

from tg import expose, request, redirect, config
from tg.i18n import ugettext as _, lazy_ugettext as l_
from repoze.what.predicates import has_permission
from webob.exc import HTTPNotFound
from skylines.lib.base import BaseController
from skylines import model, files
from skylines.lib.igc.parser import SimpleParser

class FlightController(BaseController):
    def __init__(self, flight):
        self.flight = flight

    @expose('skylines.templates.flights.view')
    def index(self):
        parser = SimpleParser()
        fixes = parser.parse(file(files.filename_to_path(self.flight.filename)))
        fixes = map(lambda fix: (fix.latlon.longitude, fix.latlon.latitude),
                    fixes)

        import cgpolyencode
        encoder = cgpolyencode.GPolyEncoder(num_levels=4)
        fixes = encoder.encode(fixes)

        return dict(page='flights', fixes=fixes)

    @expose()
    def analysis(self):
        """Hidden method that restarts flight analysis."""

        from skylines.lib.analysis import analyse_flight
        analyse_flight(self.flight)
        model.DBSession.flush()

        return redirect('/flights/id/' + str(self.flight.id))

class FlightIdController(BaseController):
    @expose()
    def lookup(self, id, *remainder):
        flight = model.DBSession.query(model.Flight).get(int(id))
        if flight is None:
            raise HTTPNotFound

        controller = FlightController(flight)
        return controller, remainder

class FlightsController(BaseController):
    @expose('skylines.templates.flights.list')
    def index(self):
        flights = model.DBSession.query(model.Flight)
        return dict(page='flights', flights=flights,
                    files_uri=config['skylines.files.uri'])

    @expose('skylines.templates.flights.list')
    def my(self):
        flights = model.DBSession.query(model.Flight)
        if request.identity is not None:
            flights = flights.filter(model.Flight.owner == request.identity['user'])
        return dict(page='flights', flights=flights,
                    files_uri=config['skylines.files.uri'])

    id = FlightIdController()
