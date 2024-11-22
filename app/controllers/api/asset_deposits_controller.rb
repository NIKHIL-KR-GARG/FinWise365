class Api::AssetDepositsController < ApplicationController
    before_action :set_asset_deposit, only: [:show, :update, :destroy]
  
    # GET /api/asset_deposits
    def index
        if params[:user_id]
            @asset_deposits = AssetDeposit.where(user_id: params[:user_id])
        else
            @asset_deposits = AssetDeposit.all
        end
        render json: @asset_deposits
    end
  
    # GET /api/asset_deposits/:id
    def show
        render json: @asset_deposit
    end
  
    # POST /api/asset_deposits
    def create
        @asset_deposit = AssetDeposit.new(asset_deposit_params)
        if @asset_deposit.save
          render json: @asset_deposit, status: :created
        else
          render json: @asset_deposit.errors, status: :unprocessable_entity
        end
    end
  
    # PUT /api/asset_deposits/:id
    def update
        if @asset_deposit.update(asset_deposit_params)
          render json: @asset_deposit
        else
          render json: @asset_deposit.errors, status: :unprocessable_entity
        end
    end
  
    # DELETE /api/asset_deposits/:id
    def destroy
        @asset_deposit.destroy
        head :no_content
    end
  
    private
  
    def set_asset_deposit
        @asset_deposit = AssetDeposit.find(params[:id])
    end
  
    def asset_deposit_params
        params.require(:asset_deposit).permit(
            :id,
            :user_id,
            :deposit_name,
            :institution_name,
            :deposit_type,
            :currency,
            :location,
            :opening_date,
            :amount,
            :deposit_term,
            :maturity_date,
            :interest_rate,
            :interest_type,
            :compounding_frequency,
            :payment_frequency,
            :payment_amount,
            :created_at,
            :updated_at
        ) 
    end
end