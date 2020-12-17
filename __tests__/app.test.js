const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/recipe');
const { testLog, testLog2, updatedTestLog, testRecipe, updatedTestRecipe, arrayOfRecipes } = require('../json.js');



describe('recipe-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });
  afterAll(() => {
    return pool.end();
  });

  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send(testRecipe)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String), ...testRecipe
        });
      });
  });

  it('gets all recipes', async () => {
    const recipes = await Promise.all(arrayOfRecipes.map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual(recipe);
        });
      });
  });

  it('gets a recipe by id', async () => {
    const recipes = await Promise.all(arrayOfRecipes.map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get('/api/v1/recipes/2')
      .then(
        res => {
          expect(res.body).toEqual(recipes[1]);
        });
  });

  it('updates a recipe by id', async () => {
    const recipe = await Recipe.insert(testRecipe);

    return request(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send(testRecipe)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String), ...testRecipe
        });
      });
  });
  it('deletes a recipe by id', async () => {
    const recipes = await Promise.all(arrayOfRecipes.map(recipe => Recipe.insert(recipe)));

    const res1 = await request(app)
      .delete('/api/v1/recipes/1');

    const res2 = await request(app)
      .delete('/api/v1/recipes/2');

    const res3 = await request(app)
      .delete('/api/v1/recipes/3');


    expect(res1.body).toEqual(recipes[0]);
    expect(res2.body).toEqual(recipes[1]);
    expect(res3.body).toEqual(recipes[2]);

  });
});
