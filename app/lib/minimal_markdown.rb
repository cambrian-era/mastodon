class MinimalMarkdown < Redcarpet::Render::Base
  def paragraph(text)
    %(<p>#{text}</p>)
  end

  def quote(quote)
    %(<q>#{quote}</q>)
  end

  def underline(text)
    %(<u>#{text}</u>)
  end

  def emphasis(text)
    %(<em>#{text}</em>)
  end

  def double_emphasis(text)
    %(<strong>#{text}</strong>)
  end

  def codespan(text)
    %(<code>#{text}</code>)
  end

  def strikethrough(text)
    %(<s>#{text}</s>)
  end

  def highlight(text)
    %(<mark>#{text}</mark>)
  end

  def normal_text(text)
    %(#{text})
  end

  def entity(text)
    puts text
    %(#{text})
  end

  def block_quote(text)
    %(<blockquote>#{text}</blockquote>)
  end
end