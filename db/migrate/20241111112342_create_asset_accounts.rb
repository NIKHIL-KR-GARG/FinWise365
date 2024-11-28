class CreateAssetAccounts < ActiveRecord::Migration[7.2]
  def change
    create_table :asset_accounts do |t|
      t.integer :user_id
      t.string :account_name
      t.string :institution_name
      t.string :account_type
      t.string :currency
      t.string :location
      t.date :opening_date
      t.float :interest_rate
      t.float :account_balance
      t.float :minimum_balance
      t.boolean :is_plan_to_close
      t.date :closure_date
      t.boolean :is_dummy_data
      
      t.timestamps
    end
  end
end
