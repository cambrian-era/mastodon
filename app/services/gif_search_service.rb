require 'http'

class GifSearchService < BaseService
  attr_accessor :query, :account

  def call(params)
    http = HTTP
      .accept(:json)
      .get("https://api.giphy.com/v1/gifs/search", :params => {
        :api_key => ENV['GIPHY_API_KEY'],
        :q => params[:query],
        :number => 50,
        :offset => params[:offset]
      })
  end
end