class MinimalMarkdown < Redcarpet::Render::HTML
  def initialize
    super(
    autolink: false,
    no_intra_emphasis: true,
    tables: false,
    strikethrough: true,
    fenced_code_blocks: true,
    disable_indented_code_blocks: true,
    underline: true,
    highlight: true,
    footnotes: false,
    no_images: true,
    no_links: true,
    quote: true)
  end

  def preprocess(text)
    text
  end
end