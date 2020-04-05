# frozen_string_literal: true

class Scheduler::TrendingTagsScheduler
  include Sidekiq::Worker

  sidekiq_options lock: :until_executed, retry: 0

  def perform
    TrendingTags.update! if Setting.trends
  end
end
