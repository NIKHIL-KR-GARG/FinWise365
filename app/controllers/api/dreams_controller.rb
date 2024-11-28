class Api::DreamsController < ApplicationController
    before_action :set_dream, only: [:show, :update, :destroy]
  
    # GET /api/dreams
    def index
        if params[:user_id]
            @dreams = Dream.where("user_id = ? OR (user_id = 0 AND is_dummy_data = ?)", params[:user_id], params[:is_display_dummy_data])
        else
            @dreams = Dream.all
        end
        render json: @dreams
    end
  
    # GET /api/dreams/:id
    def show
        render json: @dream
    end
  
    # POST /api/dreams
    def create
        @dream = Dream.new(dream_params)
        if @dream.save
          render json: @dream, status: :created
        else
          render json: @dream.errors, status: :unprocessable_entity
        end
    end
  
    # PUT /api/dreams/:id
    def update
        if @dream.update(dream_params)
          render json: @dream
        else
          render json: @dream.errors, status: :unprocessable_entity
        end
    end
  
    # DELETE /api/dreams/:id
    def destroy
        @dream.destroy
        head :no_content
    end
  
    private
  
    def set_dream
        @dream = Dream.find(params[:id])
    end
  
    def dream_params
        params.require(:dream).permit(
            :id,
            :user_id,
            :dream_name,
            :dream_type,
            :location,
            :currency,
            :dream_date,
            :amount,
            :duration,
            :end_date,
            :is_funded_by_loan,
            :loan_start_date,
            :loan_duration,
            :loan_end_date,
            :interest_rate,
            :emi_amount,
            :is_dummy_data,
            :created_at,
            :updated_at
        ) 
    end
end