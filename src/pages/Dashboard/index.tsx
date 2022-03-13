import { useState, useEffect } from 'react';

import {Header} from '../../components/Header';
import api from '../../services/api';
import { Food } from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

import { FoodType } from '../../interface/Food'

export function Dashboard(){
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState({} as FoodType);
  const [foods, setFoods] = useState<FoodType[]>([]);

  async function handleAddFood(food: FoodType){
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data])
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdateFood(food: FoodType){
    try {
      const foodUpdated = await api.put(
        `/food/${editingFood.id}`,
        {...editingFood, ...food},
      );

      const foodsUpdated = foods.map(food => food.id !== foodUpdated.data.id ? food : foodUpdated.data);
      
      setFoods(foodsUpdated);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteFood(id: number){
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal(){
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(){
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: FoodType){
    setEditingFood(food);
    setEditModalOpen(true);
  }

  useEffect(() => {
    async function fetchFoods() {
      const response = await api.get('/foods');
      setFoods(response.data);
    }

    fetchFoods();
  }, []);

  return (
    <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
  )
}