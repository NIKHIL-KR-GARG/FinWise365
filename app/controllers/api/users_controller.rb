class Api::UsersController < ApplicationController
    before_action :set_user, only: %i[show update destroy]
  
    def index
      @users = User.all
      render json: @users
    end
  
    def show
      render json: @user
    end
  
    def create
      @user = User.new(user_params)
  
      if @user.save
        render json: @user, status: :created
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    end
  
    def update
      if @user.update(user_params)
        render json: @user, status: :ok
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    end
  
    def destroy
      @user.destroy
    end
  
    def create_or_find_user
      # Assuming you receive the user email from the request parameters
      user_email = params[:email]
  
      # Check if the user exists
      @user = User.find_by(email: user_email)
  
      if @user
        # User exists, return the user or a success message
        render json: @user , status: :ok
      else
        # User does not exist, create a new user
        @user = User.new(user_params)
  
        # Check if the email is "nikhil.kr.garg@gmail.com" and set is_admin to true
        if user_email == "nikhil.kr.garg@gmail.com"
          @user.is_admin = true
        end
  
        if @user.save
          render json: @user, status: :created
        else
          render json: @user.errors, status: :unprocessable_entity
        end
      end
    end

    def check_email
        email = params[:email].to_s.downcase
        user_id = params[:user_id]

        if email.blank?
            render json: { error: 'Email is required' }, status: :bad_request
            return
        end

        user = User.where('lower(email) = ?', email).first
        is_unique = user.nil? || user.id == user_id.to_i
        render json: { isUnique: is_unique }, status: :ok
    end

    private
  
    def set_user
      @user = User.find(params[:id])
    end
  
    def user_params
      params.require(:user).permit(
        :id,
        :email,
        :is_admin,
        :first_name,
        :last_name,
        :phone_no,
        :date_of_birth,
        :country_of_residence,
        :is_permanent_resident,
        :base_currency,
        :address,
        :retirement_age,
        :life_expectancy,
        :gender,
        :nationality,
        :is_email_verified,
        :is_phone_no_verified,
        :is_display_dummy_data,
        :is_financial_advisor,
        :financial_advisor_licence_no,
        :financial_advisor_id,
        :last_login_date,
        :is_active,
        :created_at,
        :updated_at
      )
    end
  end