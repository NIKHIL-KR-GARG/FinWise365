class Api::CashflowAssetsController < ApplicationController
    before_action :set_cashflow_asset, only: [:show, :update, :destroy]
  
    # GET /api/cashflow_assets
    def index
        if params[:user_id]
            @cashflow_assets = CashflowAsset.where("user_id = ? OR (user_id = 0 AND is_dummy_data = ?)", params[:user_id], params[:is_display_dummy_data])
        else
            @cashflow_assets = CashflowAsset.all
        end
        render json: @cashflow_assets
    end
  
    # GET /api/cashflow_assets/:id
    def show
        render json: @cashflow_asset
    end
  
    # POST /api/cashflow_assets
    def create
        @cashflow_asset = CashflowAsset.new(cashflow_asset_params)
        if @cashflow_asset.save
          render json: @cashflow_asset, status: :created
        else
          render json: @cashflow_asset.errors, status: :unprocessable_entity
        end
    end

    def bulk_create
        cashflow_assets = CashflowAsset.insert_all(cashflow_asset_params[:cashflowAssets])
        render json: { status: 'success', data: cashflow_assets }, status: :created
      rescue => e
        render json: { status: 'error', message: e.message }, status: :unprocessable_entity
    end
  
    # PUT /api/cashflow_assets/:id
    def update
        if @cashflow_asset.update(cashflow_asset_params)
          render json: @cashflow_asset
        else
          render json: @cashflow_asset.errors, status: :unprocessable_entity
        end
    end
  
    # DELETE /api/cashflow_assets/:id
    def destroy
        @cashflow_asset.destroy
        head :no_content
    end
  
    private
  
    def set_cashflow_asset
        @cashflow_asset = CashflowAsset.find(params[:id])
    end

    def cashflow_asset_params
        params.require(:cashflow_asset).permit(
            :id,
            :user_id,
            :cashflow_date,
            :month,
            :year,
            :age,
            :asset_id,
            :asset_type,
            :asset_name,
            :original_asset_value,
            :asset_value,
            :is_locked,
            :is_cash,
            :growth_rate,
            :is_dummy_data,
            :cashflow_id,
            :created_at,
            :updated_at
        ) 
    end
  
    def cashflow_asset_params
        params.permit(cashflowAssets: [
            :user_id,
            :cashflow_date,
            :month,
            :year,
            :age,
            :asset_id,
            :asset_type,
            :asset_name,
            :original_asset_value,
            :asset_value,
            :is_locked,
            :is_cash,
            :growth_rate,
            :is_dummy_data,
            :cashflow_id,
        ])
    end
end