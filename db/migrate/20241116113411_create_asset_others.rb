class CreateAssetOthers < ActiveRecord::Migration[7.2]
  def change
    create_table :asset_others do |t|
      t.integer :user_id
      t.string :asset_name
      t.string :institution_name
      t.string :location
      t.string :currency
      t.date :start_date
      t.float :lumpsum_amount
      t.float :growth_rate
      t.boolean :is_recurring_payment
      t.string :payment_frequency
      t.float :payment_amount
      t.date :payment_end_date
      t.string :payout_type
      t.date :payout_date
      t.integer :payout_age
      t.integer :payout_duration
      t.float :payout_value
      t.float :total_interest
      t.float :total_principal
      t.string :payout_frequency
      t.boolean :is_dummy_data
      
      t.timestamps
    end
  end
end
