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
    gif_url = JSON.parse(info_http.body().to_s)['data']['images']['url']

    media_http = HTTP
      .accept('image/*')
      .get(gif_url)
    
    file = Tempfile.new([SecureRandom.hex(8), gif_url.split('/').last.split('.').last])

    media_http.body.each { |chunk|
      file.syswrite(chunk)
    }

    gifDispatch = ActionDispatch::Http::UploadedFile.new(
      tempfile: file,
      filename: file.path[5..-1],
      type: media_http.mime_type
    )
  end
end