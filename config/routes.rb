OpenStreetArt::Application.routes.draw do

  resources :spots do
    collection do
      post 'remote_create'
    end
  end
  

  devise_for :users

  root :to => 'home#index'

end
