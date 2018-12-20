require 'http'

class RecaptchaService < BaseService
  attr_accessor :query, :account

  def call(params)
    http = HTTP
      .accept(:json)
      .post("https://www.google.com/recaptcha/api/siteverify", :params => {
        :secret => ENV['RECAPTCHA_SECRET_KEY'],
        :response => params[:recaptcha_token],
        :ip => params[:ip]
      })
  end
end