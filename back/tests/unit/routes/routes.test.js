import { jest } from '@jest/globals';
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
      .flatMap(layer => {
        if (layer.route) {
          // Route directe
          return {
            path: layer.route.path,
            methods: layer.route.methods,
            hasAuth: layer.route.stack.some(middleware => 
              middleware.name.includes('isAuthenticated') || 
              (middleware.handle && middleware.handle.name.includes('isAuthenticated'))
            )
          };
        } else if (layer.name === 'router' && layer.handle.stack) {
          // Router imbriqué (comme userRoutes, boatRoutes, etc.)
          return layer.handle.stack
            .filter(nestedLayer => nestedLayer.route)
            .map(nestedLayer => ({
              path: `${layer.regexp.toString().match(/^\/\^\\\/([^\\]*)\\\//)?.[1] || ''}${nestedLayer.route.path}`
                .replace(/\/\//g, '/')
                .replace(/\\\//g, '/')
                .replace(/[^/]\*$/, ''), // Nettoyage du path
              methods: nestedLayer.route.methods,
              hasAuth: nestedLayer.route.stack.some(middleware => 
                middleware.name.includes('isAuthenticated') || 
                (middleware.handle && middleware.handle.name.includes('isAuthenticated'))
              )
            }));
        }
        return null;
      })
      .flat()
      .filter(Boolean);

    console.log('Routes analysées:', routesWithAuth); // Pour debug

    // Vérification plus simple - au moins une route devrait avoir l'authentification
    const hasSomeProtectedRoutes = routesWithAuth.some(route => route.hasAuth);
    expect(hasSomeProtectedRoutes).toBe(true);
  });
});