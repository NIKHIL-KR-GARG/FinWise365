class AddIsDreamToAssetAndLiabilities < ActiveRecord::Migration[7.2]
  def change
    add_column :asset_properties, :is_dream, :boolean, default: false
    add_column :asset_vehicles, :is_dream, :boolean, default: false
    add_column :asset_accounts, :is_dream, :boolean, default: false
    add_column :asset_deposits, :is_dream, :boolean, default: false
    add_column :asset_incomes, :is_dream, :boolean, default: false
    add_column :asset_portfolios, :is_dream, :boolean, default: false
    add_column :asset_others, :is_dream, :boolean, default: false
    add_column :expense_homes, :is_dream, :boolean, default: false
    add_column :expense_properties, :is_dream, :boolean, default: false
    add_column :expense_credit_card_debts, :is_dream, :boolean, default: false
    add_column :expense_personal_loans, :is_dream, :boolean, default: false
    add_column :expense_others, :is_dream, :boolean, default: false
  end
end
