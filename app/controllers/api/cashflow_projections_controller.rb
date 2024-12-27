class Api::CashflowProjectionsController < ApplicationController
    before_action :set_cashflow_projection, only: [:show, :update, :destroy]
  
    # GET /api/cashflow_projections
    def index
        if params[:user_id]
            @cashflow_projections = CashflowProjection.where("user_id = ? OR (user_id = 0 AND is_dummy_data = ?)", params[:user_id], params[:is_display_dummy_data])
        else
            @cashflow_projections = CashflowProjection.all
        end
        render json: @cashflow_projections
    end
  
    # GET /api/cashflow_projections/:id
    def show
        render json: @cashflow_projection
    end
  
    # POST /api/cashflow_projections
    def create
        @cashflow_projection = CashflowProjection.new(cashflow_projection_params)
        if @cashflow_projection.save
          render json: @cashflow_projection, status: :created
        else
          render json: @cashflow_projection.errors, status: :unprocessable_entity
        end
    end

    def bulk_create
        cashflow_projections = CashflowProjection.insert_all(cashflow_projection_params[:cashflowProjections])
        render json: { status: 'success', data: cashflow_projections }, status: :created
      rescue => e
        render json: { status: 'error', message: e.message }, status: :unprocessable_entity
    end
  
    # PUT /api/cashflow_projections/:id
    def update
        if @cashflow_projection.update(cashflow_projection_params)
          render json: @cashflow_projection
        else
          render json: @cashflow_projection.errors, status: :unprocessable_entity
        end
    end
  
    # DELETE /api/cashflow_projections/:id
    def destroy
        @cashflow_projection.destroy
        head :no_content
    end
  
    private
  
    def set_cashflow_projection
        @cashflow_projection = CashflowProjection.find(params[:id])
    end

    def cashflow_projection_params
        params.require(:cashflow_projection).permit(
            :id,
            :user_id,
            :cashflow_date,
            :is_dummy_data,
            :cashflow_id,
            :created_at,
            :updated_at
        ) 
    end
  
end