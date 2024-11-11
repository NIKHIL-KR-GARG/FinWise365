class CreateAssetVehicles < ActiveRecord::Migration[7.2]
  def change
    create_table :asset_vehicles do |t|
      t.integer :user_id
      t.string :vehicle_name
      t.string :vehicle_type
      t.string :vehicle_location
      t.date :purchase_date
      t.string :currency
      t.float :purchase_price
      t.float :coe_paid
      t.float :tentative_current_value
      t.float :annual_maintenance_amount
      t.float :monthly_expenses
      t.boolean :is_under_loan
      t.float :loan_amount
      t.integer :loan_remaining_duration
      t.string :loan_type
      t.float :loan_interest_rate
      t.boolean :is_plan_to_sell
      t.date :tentative_sale_date
      t.float :tentative_sale_amount
      t.float :scrap_value
      
      t.timestamps
    end
  end
end
