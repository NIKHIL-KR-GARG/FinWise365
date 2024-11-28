class CreateAssetVehicles < ActiveRecord::Migration[7.2]
  def change
    create_table :asset_vehicles do |t|
      t.integer :user_id
      t.string :vehicle_name
      t.string :vehicle_type
      t.string :location
      t.date :purchase_date
      t.string :currency
      t.float :purchase_price
      t.float :coe_paid
      t.float :current_value
      t.float :vehicle_maintanance
      t.float :monthly_expenses
      t.boolean :is_funded_by_loan
      t.float :loan_amount
      t.integer :loan_duration
      t.string :loan_type
      t.float :loan_interest_rate
      t.boolean :is_plan_to_sell
      t.date :sale_date
      t.float :sale_amount
      t.float :scrap_value
      t.float :depreciation_rate
      t.float :ltv_percentage
      t.float :ltv_value
      t.float :down_payment
      t.float :emi_amount
      t.float :interest_payments
      t.float :total_cost
      t.boolean :is_on_lease
      t.date :lease_start_date
      t.date :lease_end_date
      t.float :lease_amount
      t.float :lease_growth_rate
      t.boolean :is_dummy_data
      
      t.timestamps
    end
  end
end
