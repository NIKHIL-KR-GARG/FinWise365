class Api::AssetIncomesController < ApplicationController
    before_action :set_asset_income, only: [:show, :update, :destroy]
  
    # GET /api/asset_incomes
    def index
        if params[:user_id]
            @asset_incomes = AssetIncome.where("user_id = ? OR (user_id = 0 AND is_dummy_data = ?)", params[:user_id], params[:is_display_dummy_data])
        else
            @asset_incomes = AssetIncome.all
        end
        render json: @asset_incomes
    end
  
    # GET /api/asset_incomes/:id
    def show
        render json: @asset_income
    end
  
    # POST /api/asset_incomes
    def create
        @asset_income = AssetIncome.new(asset_income_params)
        if @asset_income.save
          render json: @asset_income, status: :created
        else
          render json: @asset_income.errors, status: :unprocessable_entity
        end
    end
  
    # PUT /api/asset_incomes/:id
    def update
        if @asset_income.update(asset_income_params)
          render json: @asset_income
        else
          render json: @asset_income.errors, status: :unprocessable_entity
        end
    end
  
    # DELETE /api/asset_incomes/:id
    def destroy
        @asset_income.destroy
        head :no_content
    end
  
    private
  
    def set_asset_income
        @asset_income = AssetIncome.find(params[:id])
    end
  
    def asset_income_params
        params.require(:asset_income).permit(
            :id,
            :user_id,
            :income_name,
            :income_type,
            :location,
            :currency,
            :amount,
            :start_date,
            :end_date,
            :is_recurring,
            :income_frequency,
            :growth_rate,
            :is_dummy_data,
            :created_at,
            :updated_at
        ) 
    end
end