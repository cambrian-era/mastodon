class MinimalMarkdown < Redcarpet::Render::HTML

  def preprocess(text)
    text.gsub(/\n/, '<br />')
  end
end
