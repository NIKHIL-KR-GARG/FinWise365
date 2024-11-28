class CreateAssetPortfolios < ActiveRecord::Migration[7.2]
  def change
    create_table :asset_portfolios do |t|
      t.integer :user_id
      t.string :portfolio_name
      t.string :institution_name
      t.string :portfolio_type
      t.string :location
      t.string :currency
      t.date :buying_date
      t.float :buying_value
      t.float :growth_rate
      t.float :coupon_rate
      t.string :coupon_frequency
      t.date :maturity_date
      t.boolean :is_paying_dividend
      t.float :dividend_rate
      t.float :dividend_amount
      t.string :dividend_frequency
      t.boolean :is_plan_to_sell
      t.date :sale_date
      t.float :sale_value
      t.boolean :is_sip
      t.float :sip_amount
      t.string :sip_frequency
      t.float :buy_price
      t.float :current_value
      t.float :profit
      t.float :profit_percentage
      t.float :loss
      t.float :loss_percentage
      t.boolean :is_dummy_data
      
      t.timestamps
    end
  end
end
