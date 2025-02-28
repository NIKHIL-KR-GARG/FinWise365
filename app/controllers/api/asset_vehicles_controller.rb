class Api::AssetVehiclesController < ApplicationController
    before_action :set_asset_vehicle, only: [:show, :update, :destroy]
  
    # GET /api/asset_vehicles
    def index
        if params[:user_id]
            @asset_vehicles = AssetVehicle.where("user_id = ? OR (user_id = 0 AND is_dummy_data = ?)", params[:user_id], params[:is_display_dummy_data])
        else
            @asset_vehicles = AssetVehicle.all
        end
        render json: @asset_vehicles
    end
  
    # GET /api/asset_vehicles/:id
    def show
        render json: @asset_vehicle
    end
  
    # POST /api/asset_vehicles
    def create
        @asset_vehicle = AssetVehicle.new(asset_vehicle_params)
        if @asset_vehicle.save
          render json: @asset_vehicle, status: :created
        else
          render json: @asset_vehicle.errors, status: :unprocessable_entity
        end
    end
  
    # PUT /api/asset_vehicles/:id
    def update
        if @asset_vehicle.update(asset_vehicle_params)
          render json: @asset_vehicle
        else
          render json: @asset_vehicle.errors, status: :unprocessable_entity
        end
    end
  
    # DELETE /api/asset_vehicles/:id
    def destroy
        @asset_vehicle.destroy
        head :no_content
    end
  
    private
  
    def set_asset_vehicle
        @asset_vehicle = AssetVehicle.find(params[:id])
    end
  
    def asset_vehicle_params
        params.require(:asset_vehicle).permit(
            :id,
            :user_id,
            :vehicle_name,
            :vehicle_type,
            :location,
            :purchase_date,
            :currency,
            :purchase_price,
            :coe_paid,
            :current_value,
            :vehicle_maintanance,
            :monthly_expenses,
            :is_funded_by_loan,
            :loan_as_of_date,
            :loan_amount,
            :loan_duration,
            :loan_type,
            :loan_interest_rate,
            :ltv_percentage,
            :ltv_value,
            :down_payment,
            :emi_amount,
            :interest_payments,
            :total_cost,
            :is_on_lease,
            :lease_start_date,
            :lease_end_date,
            :lease_amount,
            :lease_growth_rate,
            :is_plan_to_sell,
            :sale_date,
            :sale_amount,
            :scrap_value,
            :depreciation_rate,
            :is_dummy_data,
            :is_dream,
            :created_at,
            :updated_at
        ) 
    end
end