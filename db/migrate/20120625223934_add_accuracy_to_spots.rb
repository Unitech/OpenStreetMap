class AddAccuracyToSpots < ActiveRecord::Migration
  def change
    add_column :spots, :accuracy, :float
  end
end
