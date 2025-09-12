// tests/unit/routes/routes.test.js
import request from 'supertest';
import express from 'express';
import router from '../../../routes/routes.js';

const app = express();
app.use(express.json());
app.use(router);

describe('Main Routes File', () => {
  test('GET / should return welcome message', async () => {
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({ 
      message: 'Welcome to the SailingLoc API' 
    });
  });

  test('All routes should be defined', () => {
    // Vérifie que le router a bien toutes les routes
    expect(router.stack).toBeDefined();
    expect(router.stack.length).toBeGreaterThan(0);
  });

  test('Routes should use correct middlewares', () => {
    // Vérifie que les routes avec isAuthenticated sont bien protégées
    const routesWithAuth = router.stack
      .filter(layer => layer.route || (layer.name === 'router' && layer.handle.stack))
      .map(layer => {
        if (layer.route) {
          return {
            path: layer.route.path,
            methods: layer.route.methods,
            hasAuth: layer.route.stack.some(middleware => middleware.name.includes('isAuthenticated'))
          };
        }
        return null;
      })
      .filter(Boolean);

    // Exemple de vérification pour une route spécifique
    const userRoute = routesWithAuth.find(r => r.path === '/users');
    expect(userRoute?.hasAuth).toBe(true);
  });
});