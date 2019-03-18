# frozen_string_literal: true

class Auth::RegistrationsController < Devise::RegistrationsController
  layout :determine_layout

  before_action :set_invite, only: [:new, :create]
  before_action :check_enabled_registrations, only: [:new, :create]
  before_action :configure_sign_up_params, only: [:create]
  before_action :set_sessions, only: [:edit, :update]
  before_action :set_instance_presenter, only: [:new, :create, :update]
  before_action :set_body_classes, only: [:new, :create, :edit, :update]

  @captcha_on = ActiveModel::Type::Boolean.new.cast(ENV['RECAPTCHA'])

  # We need to modify the CSP in order to get the reCaptcha code.
  if @captcha_on
    after_action :set_csp, only: [:new, :create]
  end

  def destroy
    not_found
  end

  def create
    # Strip the user params of the recaptcha token.
    token = params["user"]["recaptcha_token"]
    params["user"].delete("recaptcha_token")

    build_resource(sign_up_params)

    if check_captcha(token)
      resource.save

      yield resource if block_given?
      if resource.persisted?
        if resource.active_for_authentication?
          set_flash_message! :notice, :signed_up
          sign_up(resource_name, resource)
          respond_with resource, location: after_sign_up_path_for(resource)
        else
          set_flash_message! :notice, :"signed_up_but_#{resource.inactive_message}"
          expire_data_after_sign_in!
          respond_with resource, location: after_inactive_sign_up_path_for(resource)
        end
      else
        clean_up_passwords resource
        set_minimum_password_length
        respond_with resource
      end
    else
      render :captcha_fail
    end
  end

  protected

  def check_captcha(token)
    # Return true if we're bypassing captcha.
    if !@captcha_on
      return true
    end

    response = RecaptchaService.new.call({
      recaptcha_token: token,
      ip: request.remote_ip
    })

    captcha_response = JSON.parse(response.body)

    logger.info "Address: #{request.remote_ip} returned a score of #{captcha_response["score"]}"

    if (captcha_response['success'] == true && captcha_response['score'].to_f() > ENV['RECAPTCHA_SCORE_THRESHOLD'].to_f()) then
      return true
    else
      return false
    end
  end

  def update_resource(resource, params)
    params[:password] = nil if Devise.pam_authentication && resource.encrypted_password.blank?
    super
  end

  def build_resource(hash = nil)
    super(hash)

    resource.locale      = I18n.locale
    resource.invite_code = params[:invite_code] if resource.invite_code.blank?
    resource.agreement   = true

    resource.current_sign_in_ip = request.remote_ip if resource.current_sign_in_ip.nil?
    resource.build_account if resource.account.nil?
  end

  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up) do |u|
      u.permit({ account_attributes: [:username] }, :email, :password, :password_confirmation, :invite_code, :recaptcha_token)
    end
  end

  def after_sign_up_path_for(_resource)
    new_user_session_path
  end

  def after_sign_in_path_for(_resource)
    set_invite

    if @invite&.autofollow?
      short_account_path(@invite.user.account)
    else
      super
    end
  end

  def after_inactive_sign_up_path_for(_resource)
    new_user_session_path
  end

  def after_update_path_for(_resource)
    edit_user_registration_path
  end

  def check_enabled_registrations
    redirect_to root_path if single_user_mode? || !allowed_registrations?
  end

  def allowed_registrations?
    Setting.registrations_mode != 'none' || @invite&.valid_for_use?
  end

  def invite_code
    if params[:user]
      params[:user][:invite_code]
    else
      params[:invite_code]
    end
  end

  private

  def set_instance_presenter
    @instance_presenter = InstancePresenter.new
  end

  def set_body_classes
    @body_classes = %w(edit update).include?(action_name) ? 'admin' : 'lighter'
  end

  def set_invite
    @invite = invite_code.present? ? Invite.find_by(code: invite_code) : nil
  end

  def determine_layout
    %w(edit update).include?(action_name) ? 'admin' : 'auth'
  end

  def set_sessions
    @sessions = current_user.session_activations
  end

  def set_csp
    response.set_header('Content-Security-Policy', "default-src *; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/")
  end
end
