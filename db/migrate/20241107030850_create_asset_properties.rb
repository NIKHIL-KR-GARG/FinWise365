class CreateAssetProperties < ActiveRecord::Migration[7.2]
  def change
    create_table :asset_properties do |t|
      t.integer :user_id
      t.string :property_name
      t.string :property_type
      t.string :property_location
      t.integer :property_number
      t.date :purchase_date
      t.string :currency
      t.float :purchase_price
      t.float :stamp_duty
      t.float :other_fees
      t.float :tentative_current_value
      t.boolean :is_primary_property
      t.boolean :is_under_loan
      t.float :loan_amount
      t.integer :loan_remaining_duration
      t.string :loan_type
      t.float :loan_interest_rate
      t.boolean :is_loan_locked
      t.date :loan_locked_till
      t.boolean :is_on_rent
      t.float :rental_amount
      t.float :property_value_growth_rate
      t.boolean :is_plan_to_sell
      t.date :tentative_sale_date
      t.float :tentative_sale_amount
      t.float :annual_property_tax_amount
      t.float :annual_property_maintenance_amount

      t.timestamps
    end
  end
end
