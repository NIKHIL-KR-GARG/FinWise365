Rails.application.routes.draw do

  root to: 'site#index'
  
  get 'home', to: 'site#index'
  get 'logincallback', to: 'site#index'
  get 'accountsettings', to: 'site#index'
  get 'incomes', to: 'site#index'
  get 'assets', to: 'site#index'
  get 'expenses', to: 'site#index'
  get 'dreams', to: 'site#index'
  get 'cashflows', to: 'site#index'
  get 'cashflowcomparison', to: 'site#index'
  get 'simulations', to: 'site#index'
  get 'contactus', to: 'site#index'
  get 'aboutus', to: 'site#index'
  get 'helpcentre', to: 'site#index'
  get 'comingsoon', to: 'site#index'
  get 'adminfunctions', to: 'site#index'
  get 'disclaimerandpolicy', to: 'site#index'

  namespace :api do
    resources :users, only: %i[index show create destroy update] do
      collection do
        post 'create_or_find_user'
      end
    end

    resources :asset_properties, only: %i[index show create destroy update]
    resources :asset_vehicles, only: %i[index show create destroy update]
    resources :asset_accounts, only: %i[index show create destroy update]
    resources :asset_deposits, only: %i[index show create destroy update]
    resources :asset_incomes, only: %i[index show create destroy update]
    resources :asset_portfolios, only: %i[index show create destroy update]
    resources :asset_portfolio_details, only: %i[index show create destroy update] do
      collection do
        delete 'delete_by_portfolio_id/:portfolio_id', to: 'asset_portfolio_details#destroy_by_portfolio_id'
      end
    end
    resources :asset_others, only: %i[index show create destroy update]

    resources :expense_homes, only: %i[index show create destroy update]
    resources :expense_properties, only: %i[index show create destroy update]
    resources :expense_credit_card_debts, only: %i[index show create destroy update]
    resources :expense_personal_loans, only: %i[index show create destroy update]
    resources :expense_others, only: %i[index show create destroy update]

    resources :dreams, only: %i[index show create destroy update]

    resources :cashflow_projections, only: %i[index show create destroy update]

    resources :cashflow_assets, only: %i[index show create destroy update] do
      collection do
        post 'bulk', to: 'cashflow_assets#bulk_create'
      end
    end

    resources :cashflow_liabilities, only: %i[index show create destroy update] do
      collection do
        post 'bulk', to: 'cashflow_liabilities#bulk_create'
      end
    end

    resources :cashflow_net_positions, only: %i[index show create destroy update] do
      collection do
        post 'bulk', to: 'cashflow_net_positions#bulk_create'
      end
    end

    resources :contact_admins, only: %i[index show create destroy update] do
      collection do
        put 'mark_as_read'
        put 'mark_as_unread'
        put 'mark_as_replied'
        put 'mark_as_notreplied'
        delete 'bulk_destroy'
      end
    end

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
