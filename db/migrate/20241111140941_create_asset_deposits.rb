class CreateAssetDeposits < ActiveRecord::Migration[7.2]
  def change
    create_table :asset_deposits do |t|
      t.integer :user_id
      t.string :deposit_name
      t.string :institution_name
      t.string :deposit_type
      t.string :location
      t.string :currency
      t.date :opening_date
      t.float :amount
      t.integer :deposit_term
      t.date :maturity_date
      t.float :interest_rate
      t.string :interest_type
      t.string :compounding_frequency
      t.string :payment_frequency
      t.float :payment_amount

      t.timestamps
    end
  end
end
