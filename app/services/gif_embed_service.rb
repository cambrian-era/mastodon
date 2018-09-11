require 'http'
require 'json'
require 'tempfile'

class GifEmbedService < BaseService
  attr_accessor :query, :account

  def call(id)
    info_http = HTTP
      .accept(:json) # Download the GIF information.
      .get("http://api.giphy.com/v1/gifs/#{id}", :params => {
        :api_key => ENV['GIPHY_API_KEY']
      }) 
    gif_url = JSON.parse(info_http.body().to_s)['data']['images']['downsized_still']['url']

    media_http = HTTP
      .accept('image/*')
      .get(gif_url)
    
    file = Tempfile.new('gif')

    media_http.body.each { |chunk|
      file.syswrite(chunk)
    }

    gifDispatch = ActionDispatch::Http::UploadedFile.new(
      tempfile: file,
      filename: gif_url.split('/').last,
      type: media_http.mime_type
    )
  end
end