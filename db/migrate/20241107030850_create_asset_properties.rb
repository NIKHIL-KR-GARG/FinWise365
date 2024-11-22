class CreateAssetProperties < ActiveRecord::Migration[7.2]
  def change
    create_table :asset_properties do |t|
      t.integer :user_id
      t.string :property_name
      t.string :property_type
      t.string :location
      t.integer :property_number
      t.date :purchase_date
      t.string :currency
      t.float :purchase_price
      t.float :stamp_duty
      t.float :other_fees
      t.float :current_value
      t.boolean :is_primary_property
      t.boolean :is_funded_by_loan
      t.float :loan_amount
      t.integer :loan_duration
      t.string :loan_type
      t.float :loan_interest_rate
      t.boolean :is_loan_locked
      t.date :loan_locked_till
      t.boolean :is_on_rent
      t.date :rental_start_date
      t.date :rental_end_date
      t.float :rental_amount
      t.float :growth_rate
      t.boolean :is_plan_to_sell
      t.date :sale_date
      t.float :sale_amount
      t.float :property_tax
      t.float :property_maintenance
      t.float :buyer_stamp_duty
      t.float :additional_buyer_stamp_duty
      t.float :ltv_percentage
      t.float :ltv_value
      t.float :down_payment
      t.float :emi_amount
      t.float :interest_payments
      t.float :total_cost

      t.timestamps
    end
  end
end
