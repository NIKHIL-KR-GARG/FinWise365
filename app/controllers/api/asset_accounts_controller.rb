class Api::AssetAccountsController < ApplicationController
    before_action :set_asset_account, only: [:show, :update, :destroy]
  
    # GET /api/asset_accounts
    def index
        if params[:user_id]
            @asset_accounts = AssetAccount.where("user_id = ? OR (user_id = 0 AND is_dummy_data = ?)", params[:user_id], params[:is_display_dummy_data])
        else
            @asset_accounts = AssetAccount.all
        end
        render json: @asset_accounts
    end
  
    # GET /api/asset_accounts/:id
    def show
        render json: @asset_account
    end
  
    # POST /api/asset_accounts
    def create
        @asset_account = AssetAccount.new(asset_account_params)
        if @asset_account.save
          render json: @asset_account, status: :created
        else
          render json: @asset_account.errors, status: :unprocessable_entity
        end
    end
  
    # PUT /api/asset_accounts/:id
    def update
        if @asset_account.update(asset_account_params)
          render json: @asset_account
        else
          render json: @asset_account.errors, status: :unprocessable_entity
        end
    end
  
    # DELETE /api/asset_accounts/:id
    def destroy
        @asset_account.destroy
        head :no_content
    end
  
    private
  
    def set_asset_account
        @asset_account = AssetAccount.find(params[:id])
    end
  
    def asset_account_params
        params.require(:asset_account).permit(
            :id,
            :user_id,
            :account_name,
            :institution_name,
            :account_type,
            :currency,
            :location,
            :opening_date,
            :interest_rate,
            :account_balance,
            :minimum_balance,
            :is_plan_to_close,
            :closure_date,
            :is_dummy_data,
            :created_at,
            :updated_at
        ) 
    end
end