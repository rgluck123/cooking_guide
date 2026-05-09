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
        image: "/cooking_guide/images/authentic-lebanese-chicken-steps/cut-the-onion.png",
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
        image: "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=400&q=80",
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
  },
  '4': {
    id: '4',
    name: 'Lebanese Fattoush Salad',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    time: '20 mins',
    difficulty: 'Beginner',
    portions: '2 portions',
    defaultPortions: 2,
    ingredients: [
      { id: 1, name: 'Pita Bread', quantity: '2', unit: '', baseQuantity: 1, originalName: 'Pita Bread', edited: false, removed: false, originalPosition: 1, assignedSteps: [1] },
      { id: 2, name: 'Romaine Lettuce', quantity: '1 head', unit: '', baseQuantity: 0.5, originalName: 'Romaine Lettuce', edited: false, removed: false, originalPosition: 2, assignedSteps: [2] },
      { id: 3, name: 'Tomatoes', quantity: '2', unit: '', baseQuantity: 1, originalName: 'Tomatoes', edited: false, removed: false, originalPosition: 3, assignedSteps: [2] },
      { id: 4, name: 'Cucumbers', quantity: '2', unit: '', baseQuantity: 1, originalName: 'Cucumbers', edited: false, removed: false, originalPosition: 4, assignedSteps: [2] },
      { id: 5, name: 'Radishes', quantity: '4', unit: '', baseQuantity: 2, originalName: 'Radishes', edited: false, removed: false, originalPosition: 5, assignedSteps: [2] },
      { id: 6, name: 'Olive Oil', quantity: '3 tbsp', unit: 'tbsp', baseQuantity: 1.5, originalName: 'Olive Oil', edited: false, removed: false, originalPosition: 6, assignedSteps: [3] },
      { id: 7, name: 'Lemon Juice', quantity: '2 tbsp', unit: 'tbsp', baseQuantity: 1, originalName: 'Lemon Juice', edited: false, removed: false, originalPosition: 7, assignedSteps: [3] },
      { id: 8, name: 'Sumac', quantity: '1 tbsp', unit: 'tbsp', baseQuantity: 0.5, originalName: 'Sumac', edited: false, removed: false, originalPosition: 8, assignedSteps: [3] }
    ],
    steps: [
      { id: 1, title: "Prepare Pita", instruction: "Cut the pita bread into 1-inch squares. Toast in a 375°F (190°C) oven for 5-8 minutes until golden brown and crispy.", image: "https://images.unsplash.com/photo-1562277729-214aa1971717?auto=format&fit=crop&w=400&q=80", hasTimer: true, timerSeconds: 480 },
      { id: 2, title: "Chop Vegetables", instruction: "Coarsely chop the romaine lettuce. Dice the tomatoes and cucumbers. Thinly slice the radishes. Place all in a large mixing bowl.", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80", hasTimer: false },
      { id: 3, title: "Make Dressing", instruction: "In a small jar, whisk together olive oil, lemon juice, sumac, and a pinch of salt until well emulsified.", image: "https://images.unsplash.com/photo-1470333732907-3f23a9d0e241?auto=format&fit=crop&w=400&q=80", hasTimer: false },
      { id: 4, title: "Toss and Serve", instruction: "Add the toasted pita to the bowl of vegetables. Pour the dressing over everything and toss gently to combine. Serve immediately while the pita is still crunchy.", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=80", hasTimer: false }
    ]
  },
  '5': {
    id: '5',
    name: 'Lebanese Hummus & Pita',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&w=800&q=80',
    time: '15 mins',
    difficulty: 'Beginner',
    portions: '2 portions',
    defaultPortions: 2,
    ingredients: [
      { id: 1, name: 'Chickpeas', quantity: '1 can', unit: 'can', baseQuantity: 0.5, originalName: 'Chickpeas', edited: false, removed: false, originalPosition: 1, assignedSteps: [1, 2] },
      { id: 2, name: 'Tahini', quantity: '1/2 cup', unit: 'cup', baseQuantity: 0.25, originalName: 'Tahini', edited: false, removed: false, originalPosition: 2, assignedSteps: [3] },
      { id: 3, name: 'Garlic', quantity: '2 cloves', unit: 'cloves', baseQuantity: 1, originalName: 'Garlic', edited: false, removed: false, originalPosition: 3, assignedSteps: [3] },
      { id: 4, name: 'Lemon Juice', quantity: '3 tbsp', unit: 'tbsp', baseQuantity: 1.5, originalName: 'Lemon Juice', edited: false, removed: false, originalPosition: 4, assignedSteps: [3] },
      { id: 5, name: 'Olive Oil', quantity: '2 tbsp', unit: 'tbsp', baseQuantity: 1, originalName: 'Olive Oil', edited: false, removed: false, originalPosition: 5, assignedSteps: [4] }
    ],
    steps: [
      { id: 1, title: "Rinse Chickpeas", instruction: "Drain the chickpeas and rinse them thoroughly under cold water to remove the canning liquid.", image: "https://images.unsplash.com/photo-1585821321301-3011013a76ae?auto=format&fit=crop&w=400&q=80", hasTimer: false },
      { id: 2, title: "Simmer Chickpeas", instruction: "Place chickpeas in a pot with a pinch of baking soda. Cover with water and simmer for 10-15 minutes until they are very soft and falling apart.", image: "https://images.unsplash.com/photo-1594911771141-860e6f5c8ec5?auto=format&fit=crop&w=400&q=80", hasTimer: true, timerSeconds: 900 },
      { id: 3, title: "Blend for Fluffiness", instruction: "Process the warm chickpeas in a food processor until a thick paste forms. Add tahini, crushed garlic, and lemon juice. While blending, slowly add 2-3 tablespoons of ice-cold water until the hummus is light and airy.", image: "https://images.unsplash.com/photo-1637949385162-e416fb15b2ce?auto=format&fit=crop&w=400&q=80", hasTimer: false },
      { id: 4, title: "Garnish and Serve", instruction: "Transfer the hummus to a shallow bowl. Create a well in the center with a spoon, drizzle generously with olive oil, and sprinkle with a dash of paprika. Serve with warm pita bread.", image: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&w=400&q=80", hasTimer: false }
    ]
  },
  '6': {
    id: '6',
    name: 'Lebanese Falafel Wrap',
    image: 'https://images.unsplash.com/photo-1547050605-2f122ffad69a?auto=format&fit=crop&w=800&q=80',
    time: '30 mins',
    difficulty: 'Intermediate',
    portions: '2 portions',
    defaultPortions: 2,
    ingredients: [
      { id: 1, name: 'Falafel', quantity: '8 pieces', unit: 'pieces', baseQuantity: 4, originalName: 'Falafel', edited: false, removed: false, originalPosition: 1, assignedSteps: [1, 2] },
      { id: 2, name: 'Pita Bread', quantity: '2', unit: '', baseQuantity: 1, originalName: 'Pita Bread', edited: false, removed: false, originalPosition: 2, assignedSteps: [3] },
      { id: 3, name: 'Tahini Sauce', quantity: '1/4 cup', unit: 'cup', baseQuantity: 0.125, originalName: 'Tahini Sauce', edited: false, removed: false, originalPosition: 3, assignedSteps: [3] },
      { id: 4, name: 'Pickled Turnips', quantity: '4 slices', unit: '', baseQuantity: 2, originalName: 'Pickled Turnips', edited: false, removed: false, originalPosition: 4, assignedSteps: [3] },
      { id: 5, name: 'Fresh Parsley', quantity: '1/2 bunch', unit: '', baseQuantity: 0.25, originalName: 'Fresh Parsley', edited: false, removed: false, originalPosition: 5, assignedSteps: [3] }
    ],
    steps: [
      { id: 1, title: "Prepare Falafel", instruction: "If using pre-made falafel, warm them in a 350°F (175°C) oven for 10 minutes until heated through and slightly crispy.", image: "https://images.unsplash.com/photo-1547050605-2f122ffad69a?auto=format&fit=crop&w=400&q=80", hasTimer: true, timerSeconds: 600 },
      { id: 2, title: "Crush Falafel", instruction: "Lightly crush the warm falafel balls so they lay flat and stay inside the wrap more easily.", image: "https://images.unsplash.com/photo-1547050605-2f122ffad69a?auto=format&fit=crop&w=400&q=80", hasTimer: false },
      { id: 3, title: "Assemble Wrap", instruction: "Lay the pita bread flat. Spread a layer of tahini sauce, add the falafel, pickled turnips, and fresh parsley. Fold the sides and roll tightly into a cylinder.", image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=400&q=80", hasTimer: false },
      { id: 4, title: "Toast the Wrap", instruction: "Place the assembled wrap on a hot dry pan for 1 minute per side to seal the seam and add a nice crunch to the bread.", image: "https://images.unsplash.com/photo-1626700051175-656a42359641?auto=format&fit=crop&w=400&q=80", hasTimer: true, timerSeconds: 120 }
    ]
  }
};
