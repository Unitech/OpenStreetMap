class SpotsController < ApplicationController

  skip_before_filter :verify_authenticity_token, :only => 'remote_create'

  # GET /spots
  # GET /spots.json
  def index
    @spots = Spot.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @spots }
    end
  end

  # GET /spots/1
  # GET /spots/1.json
  def show
    @spot = Spot.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @spot }
    end
  end

  # GET /spots/new
  # GET /spots/new.json
  def new
    @spot = Spot.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @spot }
    end
  end

  # GET /spots/1/edit
  def edit
    @spot = Spot.find(params[:id])
  end


  def remote_create
    puts "a"*99
    
    data = StringIO.new(Base64.decode64(params[:spot][:main_image_base64]))
    data.class.class_eval { attr_accessor :original_filename, :content_type }
    data.original_filename = "sc.png"
    data.content_type = "image/png"

    params[:spot].delete :main_image_base64
    

    @spot = Spot.new(params[:spot])
    @spot.main_image = data
    
    puts @spot
    if @spot.save
      puts "Success"
      render :json => {:success => true}
    else
      render :json => {:success => false}
    end
  end

  # POST /spots
  # POST /spots.json
  def create
    @spot = Spot.new(params[:spot])
    
    respond_to do |format|
      if @spot.save
        format.html { redirect_to @spot, notice: 'Spot was successfully created.' }
        format.json { render json: @spot, status: :created, location: @spot }
      else
        format.html { render action: "new" }
        format.json { render json: @spot.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /spots/1
  # PUT /spots/1.json
  def update
    @spot = Spot.find(params[:id])

    respond_to do |format|
      if @spot.update_attributes(params[:spot])
        format.html { redirect_to @spot, notice: 'Spot was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @spot.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /spots/1
  # DELETE /spots/1.json
  def destroy
    @spot = Spot.find(params[:id])
    @spot.destroy

    respond_to do |format|
      format.html { redirect_to spots_url }
      format.json { head :no_content }
    end
  end
end
