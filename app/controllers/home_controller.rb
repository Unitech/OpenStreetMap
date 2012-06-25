class HomeController < ApplicationController
  def index
    @markers = Spot.all
  end

  def about
  end
end
