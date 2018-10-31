# frozen_string_literal: true

class Settings::DeletesController < ApplicationController
  layout 'admin'

  before_action :check_enabled_deletion
  before_action :authenticate_user!
  before_action :set_body_classes

  def show
    @confirmation = Form::DeleteConfirmation.new
  end

  def destroy
    if current_user.valid_password?(delete_params[:password])
      Admin::SuspensionWorker.perform_async(current_user.account_id, true)
      sign_out
      redirect_to new_user_session_path, notice: I18n.t('deletes.success_msg')
    else
      redirect_to settings_delete_path, alert: I18n.t('deletes.bad_password_msg')
    end
  end

  private

  def check_enabled_deletion
    redirect_to root_path unless Setting.open_deletion
  end

  def delete_params
    params.require(:form_delete_confirmation).permit(:password)
  end

  def set_body_classes
    @body_classes = 'admin'
  end
end
