
class Api::AssetOthersController < ApplicationController
    before_action :set_asset_other, only: [:show, :update, :destroy]
  
    # GET /api/asset_others
    def index
        if params[:user_id]
            @asset_others = AssetOther.where(user_id: params[:user_id])
        else
            @asset_others = AssetOther.all
        end
        render json: @asset_others
    end
  
    # GET /api/asset_others/:id
    def show
        render json: @asset_other
    end
  
    # POST /api/asset_others
    def create
        @asset_other = AssetOther.new(asset_other_params)
        if @asset_other.save
          render json: @asset_other, status: :created
        else
          render json: @asset_other.errors, status: :unprocessable_entity
        end
    end
  
    # PUT /api/asset_others/:id
    def update
        if @asset_other.update(asset_other_params)
          render json: @asset_other
        else
          render json: @asset_other.errors, status: :unprocessable_entity
        end
    end
  
    # DELETE /api/asset_others/:id
    def destroy
        @asset_other.destroy
        head :no_content
    end
  
    private
  
    def set_asset_other
        @asset_other = AssetOther.find(params[:id])
    end
  
    def asset_other_params
        params.require(:asset_other).permit(
            :id,
            :user_id,
            :asset_name,
            :institution_name,
            :location,
            :currency,
            :start_date,
            :lumpsum_amount,
            :growth_rate,
            :is_recurring_payment,
            :payment_frequency,
            :payment_amount,
            :payment_end_date,
            :payout_type,
            :payout_date,
            :payout_age,
            :payout_duration,
            :payout_value,
            :created_at,
            :updated_at
        ) 
    end
end