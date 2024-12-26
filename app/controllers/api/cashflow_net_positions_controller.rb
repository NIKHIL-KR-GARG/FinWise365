class Api::CashflowNetPositionsController < ApplicationController
    before_action :set_cashflow_net_position, only: [:show, :update, :destroy]
  
    # GET /api/cashflow_net_positions
    def index
        if params[:user_id]
            @cashflow_net_positions = CashflowNetPosition.where(user_id: params[:user_id])
        else
            @cashflow_net_positions = CashflowNetPosition.all
        end
        render json: @cashflow_net_positions
    end
  
    # GET /api/cashflow_net_positions/:id
    def show
        render json: @cashflow_net_position
    end
  
    # POST /api/cashflow_net_positions
    def create
        @cashflow_net_position = CashflowNetPosition.new(cashflow_net_position_params)
        if @cashflow_net_position.save
          render json: @cashflow_net_position, status: :created
        else
          render json: @cashflow_net_position.errors, status: :unprocessable_entity
        end
    end

    # POST /api/cashflow_net_positions/bulk
    def bulk_create
        cashflow_net_positions = CashflowNetPosition.insert_all(cashflow_net_positions_params[:cashflowNetPositions])
        render json: { status: 'success', data: cashflow_net_positions }, status: :created
    rescue => e
        render json: { status: 'error', message: e.message }, status: :unprocessable_entity
    end
  
    # PUT /api/cashflow_net_positions/:id
    def update
        if @cashflow_net_position.update(cashflow_net_position_params)
          render json: @cashflow_net_position
        else
          render json: @cashflow_net_position.errors, status: :unprocessable_entity
        end
    end
  
    # DELETE /api/cashflow_net_positions/:id
    def destroy
        @cashflow_net_position.destroy
        head :no_content
    end
  
    private
  
    def set_cashflow_net_position
        @cashflow_net_position = CashflowNetPosition.find(params[:id])
    end
  
    def cashflow_net_position_params
        params.require(:cashflow_net_position).permit(
            :id,
            :user_id,
            :cashflow_date,
            :month,
            :year,
            :age,
            :income,
            :expense,
            :net_position,
            :liquid_assets,
            :locked_assets,
            :net_worth,
            :created_at,
            :updated_at
        ) 
    end

    def cashflow_net_positions_params
        params.permit(cashflowNetPositions: [
            :user_id,
            :cashflow_date,
            :month,
            :year,
            :age,
            :income,
            :expense,
            :net_position,
            :liquid_assets,
            :locked_assets,
            :net_worth
        ])
    end
end