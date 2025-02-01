class AddCurrencyToCashflowProjections < ActiveRecord::Migration[7.2]
  def change
    add_column :cashflow_projections, :currency, :string
    add_column :cashflow_assets, :currency, :string
    add_column :cashflow_liabilities, :currency, :string
    add_column :cashflow_net_positions, :currency, :string
  end
end
