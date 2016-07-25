require 'rack/static'

class App
  def initialize(app)
    @app = app
  end

  def call(env)
    @app.call(env)
  end
end

use Rack::Static, urls: [''], root: 'public', index: 'index.html'
run App
