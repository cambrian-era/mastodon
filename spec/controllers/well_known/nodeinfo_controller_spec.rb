require 'rails_helper'

describe WellKnown::NodeInfoController, type: :controller do
  render_views

  describe 'GET #index' do
    it 'returns json document pointing to node info' do
      get :index

      expect(response).to have_http_status(200)
      expect(response.content_type).to eq 'application/json'

      json = body_as_json

      expect(json[:links]).to be_an Array
      expect(json[:links][0][:rel]).to eq 'http://nodeinfo.diaspora.software/ns/schema/2.0'
      expect(json[:links][0][:href]).to include 'nodeinfo/2.0'
    end
  end

  describe 'GET #show' do
    it 'returns json document with node info properties' do
      get :show

      expect(response).to have_http_status(200)
      expect(response.content_type).to eq 'application/json'

      json = body_as_json

      expect(json[:version]).to eq '2.0'
      expect(json[:usage]).to be_a Hash
      expect(json[:software]).to be_a Hash
      expect(json[:protocols]).to be_an Array
    end
  end
end
