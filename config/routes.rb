Rails.application.routes.draw do

  root to: 'site#index'
  
  get 'home', to: 'site#index'
  get 'logincallback', to: 'site#index'
  get 'accountsettings', to: 'site#index'
  get 'assets', to: 'site#index'

  #get 'users', to: 'site#index'
  #get 'users/new', to: 'site#index'
  #get 'users/:id', to: 'site#index'
  #get 'users/:id/edit', to: 'site#index'

  namespace :api do
    resources :users, only: %i[index show create destroy update] do
      collection do
        post 'create_or_find_user' # Define the route for the action
      end
    end

    resources :asset_properties, only: %i[index show create destroy update]
    resources :asset_vehicles, only: %i[index show create destroy update]
    resources :asset_accounts, only: %i[index show create destroy update]
    resources :asset_deposits, only: %i[index show create destroy update]
    resources :asset_incomes, only: %i[index show create destroy update]
    resources :asset_portfolios, only: %i[index show create destroy update]

  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  # Defines the root path route ("/")
  # root "posts#index"
end
