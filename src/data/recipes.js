export const initialRecipes = {
  'authentic-lebanese-chicken': {
    id: 'authentic-lebanese-chicken',
    name: 'Authentic Lebanese Chicken with Rice',
    image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=800&q=80',
    time: '40 mins',
    difficulty: 'Intermediate',
    portions: '2 portions',
    defaultPortions: 2,
    ingredients: [
      { id: 1, name: 'Chicken Thighs', quantity: '400g', unit: 'g', baseQuantity: 200, originalName: 'Chicken Thighs', edited: false, removed: false, originalPosition: 1, assignedSteps: [2, 7, 8] },
      { id: 2, name: 'White Rice', quantity: '190g', unit: 'g', baseQuantity: 95, originalName: 'White Rice', edited: false, removed: false, originalPosition: 2, assignedSteps: [1, 10, 11] },
      { id: 3, name: 'Water', quantity: '380ml', unit: 'ml', baseQuantity: 190, originalName: 'Water', edited: false, removed: false, originalPosition: 3, assignedSteps: [1, 10] },
      { id: 4, name: 'Yellow Onion', quantity: '1', unit: '', baseQuantity: 0.5, originalName: 'Yellow Onion', edited: false, removed: false, originalPosition: 4, assignedSteps: [3, 4] },
      { id: 5, name: 'Garlic', quantity: '3 cloves', unit: 'cloves', baseQuantity: 1.5, originalName: 'Garlic', edited: false, removed: false, originalPosition: 5, assignedSteps: [5] },
      { id: 6, name: 'Lebanese Spice Mix', quantity: '1 tbsp', unit: 'tbsp', baseQuantity: 0.5, originalName: 'Lebanese Spice Mix', edited: false, removed: false, originalPosition: 6, assignedSteps: [5] },
      { id: 7, name: 'Lemon Juice', quantity: '2 tbsp', unit: 'tbsp', baseQuantity: 1, originalName: 'Lemon Juice', edited: false, removed: false, originalPosition: 7, assignedSteps: [9, 11] },
      { id: 8, name: 'Salt & Pepper', quantity: 'to taste', unit: '', baseQuantity: 0, originalName: 'Salt & Pepper', edited: false, removed: false, originalPosition: 8, assignedSteps: [5] },
    ],
    steps: [
      {
        id: 1,
        title: "Cook the rice",
        instruction: "Rinse 190g white rice and add to a pot with 380ml water. Bring to a boil, then reduce heat and simmer covered for 18-20 minutes until tender.",
        image: "/cooking_guide/images/authentic-lebanese-chicken-steps/cook-the-rice.png",
        hasTimer: true,
        timerSeconds: 1200
      },
      {
        id: 2,
        title: "Debone the chicken",
        instruction: "Follow the detailed guide to feel the bone, slice along it, clear the joints, and remove the bone safely.",
        image: "/cooking_guide/images/deboning/debone_step_1.png",
        hasTimer: false
      },
      {
        id: 3,
        title: "Cut the onion",
        instruction: "Peel 1 yellow onion and cut it into thin slices. Try to keep them roughly the same thickness for even cooking.",
        image: "https://images.unsplash.com/photo-1608270861620-7d5e8c75c5e5?auto=format&fit=crop&w=400&q=80",
        hasTimer: false
      },
      {
        id: 4,
        title: "Heat oil in the pan",
        instruction: "Heat oil in a large pan over medium heat and add the chopped onion. Sauté for 2-3 minutes until translucent and fragrant.",
        image: "/cooking_guide/images/authentic-lebanese-chicken-steps/heat-the-oil-pan.png",
        hasTimer: true,
        timerSeconds: 180
      },
      {
        id: 5,
        title: "Add your seasoning",
        instruction: "Add a pinch of salt, pepper, and a teaspoon each of cumin, coriander, and cinnamon. Stir well to combine.",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        hasTimer: false
      },
      {
        id: 6,
        title: "Stir for 1 minute",
        instruction: "Keep stirring the spices with the onions to toast them and release their aroma.",
        image: "/cooking_guide/images/authentic-lebanese-chicken-steps/stir.png",
        hasTimer: true,
        timerSeconds: 60
      },
      {
        id: 7,
        title: "Add the chicken",
        instruction: "Push the onions to the side and place your shredded chicken in the pan. Stir to combine.",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
        hasTimer: false
      },
      {
        id: 8,
        title: "Cook the chicken",
        instruction: "Cook for about 5-8 minutes until the chicken is heated through and starts to brown slightly at the edges.",
        image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=400&q=80",
        hasTimer: true,
        timerSeconds: 480
      },
      {
        id: 9,
        title: "Add lemon",
        instruction: "Squeeze half a lemon over the chicken and gently mix. This brightens the flavors beautifully.",
        image: "https://images.unsplash.com/photo-1504544750208-dc0358e63f7b?auto=format&fit=crop&w=400&q=80",
        hasTimer: false
      },
      {
        id: 10,
        title: "Drain the rice",
        instruction: "Once the rice is cooked, drain any excess water carefully using a colander.",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80",
        hasTimer: false
      },
      {
        id: 11,
        title: "Plate and serve",
        instruction: "Divide the rice between plates and top with the chicken mixture. Serve hot with lemon slices on the side.",
        image: "/cooking_guide/images/authentic-lebanese-chicken-steps/plate-and-serve.png",
        hasTimer: false
      }
    ]
  }
};
