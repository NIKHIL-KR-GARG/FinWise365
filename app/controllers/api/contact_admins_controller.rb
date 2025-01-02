class Api::ContactAdminsController < ApplicationController
    before_action :set_contact_admin, only: [:show, :update, :destroy]
  
    # GET /api/contact_admins
    def index
        @contact_admins = ContactAdmin.all
        render json: @contact_admins
    end
  
    # GET /api/contact_admins/:id
    def show
        render json: @contact_admin
    end
  
    # POST /api/contact_admins
    def create
        @contact_admin = ContactAdmin.new(contact_admin_params)
        if @contact_admin.save
          render json: @contact_admin, status: :created
        else
          render json: @contact_admin.errors, status: :unprocessable_entity
        end
    end
  
    # PUT /api/contact_admins/:id
    def update
        if @contact_admin.update(contact_admin_params)
          render json: @contact_admin
        else
          render json: @contact_admin.errors, status: :unprocessable_entity
        end
    end

    # PUT /api/contact_admins/mark_as_read
    def mark_as_read
        ContactAdmin.where(id: params[:ids]).update_all(is_read: true)
        head :no_content
    end

    # PUT /api/contact_admins/mark_as_unread
    def mark_as_unread
        ContactAdmin.where(id: params[:ids]).update_all(is_read: false)
        head :no_content
    end

    # PUT /api/contact_admins/mark_as_replied
    def mark_as_replied
        ContactAdmin.where(id: params[:ids]).update_all(is_replied: true)
        head :no_content
    end

     # PUT /api/contact_admins/mark_as_notreplied
     def mark_as_notreplied
        ContactAdmin.where(id: params[:ids]).update_all(is_replied: false)
        head :no_content
    end

    # DELETE /api/contact_admins
    def bulk_destroy
        ContactAdmin.where(id: params[:ids]).destroy_all
        head :no_content
    end
  
    # DELETE /api/contact_admins/:id
    def destroy
        @contact_admin.destroy
        head :no_content
    end
  
    private
  
    def set_contact_admin
        @contact_admin = ContactAdmin.find(params[:id])
    end
  
    def contact_admin_params
        params.require(:contact_admin).permit(
            :id,
            :name,
            :company,
            :email,
            :message,
            :is_read,
            :is_replied,
            :created_at,
            :updated_at
        ) 
    end
end