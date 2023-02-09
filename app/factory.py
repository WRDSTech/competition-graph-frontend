from quart import Quart


def create_app() -> Quart:
    app_container = ApplicationContainer()
    app = Quart(__name__)
    app.container = app_container
    # TODO: Wire all related packages here, change parameter to packages if __name__ is not main
    app.container.wire(packages=[])
    # TODO: Register all blueprints here
    
    return app
