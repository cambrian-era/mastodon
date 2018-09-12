include ObfuscateFilename

class Api::Radical::GifController < Api::BaseController
  include ObfuscateFilename

  before_action -> { doorkeeper_authorize! :write, :'write:media' }
  before_action :require_user!

  respond_to :json

  def show
    response = GifSearchService.new.call(params[:query])

    if response.status == 200
      render :json => response.to_s
    else
      Rails.logger.error response.status
    end
  end

  def create
    gif = GifEmbedService.new.call(params[:data][:id])
    params[:file] = gif

    obfuscate_filename gif
    
    @media = current_account.media_attachments.create!(media_params)
    render json: @media, serializer: REST::MediaAttachmentSerializer
  rescue Paperclip::Errors::NotIdentifiedByImageMagickError
    render json: file_type_error, status: 422
  rescue Paperclip::Error
    render json: processing_error, status: 500
  end

  private

  def media_params
    params.permit(:file, :description, :focus)
  end

  def file_type_error
    { error: 'File type of uploaded media could not be verified' }
  end

  def processing_error
    { error: 'Error processing thumbnail for uploaded media' }
  end
end