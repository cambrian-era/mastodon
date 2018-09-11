require 'http'

class GifSearchService < BaseService
  attr_accessor :query, :account

  def call(query)
    http = HTTP
      .accept(:json)
      .get("https://api.giphy.com/v1/gifs/search", :params => {
        :api_key => ENV['GIPHY_API_KEY'],
        :q => query
      })
  end
end