class AddFieldToSpot < ActiveRecord::Migration
  def change
    add_column :spots, :author, :string
  end
end
