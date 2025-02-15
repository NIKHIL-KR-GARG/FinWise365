class Api::ExpenseHomesController < ApplicationController
    before_action :set_expense_home, only: [:show, :update, :destroy]
  
    # GET /api/expense_homes
    def index
        if params[:user_id]
            @expense_homes = ExpenseHome.where("user_id = ? OR (user_id = 0 AND is_dummy_data = ?)", params[:user_id], params[:is_display_dummy_data])
        else
            @expense_homes = ExpenseHome.all
        end
        render json: @expense_homes
    end
  
    # GET /api/expense_homes/:id
    def show
        render json: @expense_home
    end
  
    # POST /api/expense_homes
    def create
        @expense_home = ExpenseHome.new(expense_home_params)
        if @expense_home.save
          render json: @expense_home, status: :created
        else
          render json: @expense_home.errors, status: :unprocessable_entity
        end
    end
  
    # PUT /api/expense_homes/:id
    def update
        if @expense_home.update(expense_home_params)
          render json: @expense_home
        else
          render json: @expense_home.errors, status: :unprocessable_entity
        end
    end
  
    # DELETE /api/expense_homes/:id
    def destroy
        @expense_home.destroy
        head :no_content
    end
  
    private
  
    def set_expense_home
        @expense_home = ExpenseHome.find(params[:id])
    end
  
    def expense_home_params
        params.require(:expense_home).permit(
            :id,
            :user_id,
            :home_name,
            :start_date,
            :end_date,
            :location,
            :currency,
            :groceries,
            :clothes,
            :utilities,
            :furniture,
            :health,
            :transport,
            :communication,
            :entertainment,
            :education,
            :dining,
            :holidays,
            :miscellaneous,
            :rental,
            :alcohol,
            :total_expense,
            :inflation_rate,
            :is_dummy_data,
            :is_dream,
            :created_at,
            :updated_at
        ) 
    end
end