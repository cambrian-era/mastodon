class Api::Radical::GifController < Api::BaseController
  before_action :require_user!

  respond_to :json

  def show
    response = GifService.new.call(params[:query])
    if response.status == 200
      render :json => response.to_s
    else
      Rails.logger.error response.status
    end
  end

  def create
    Rails.logger.debug params[:id]
  end
end