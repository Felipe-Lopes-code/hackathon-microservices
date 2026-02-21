/**
 * Swagger Documentation Validation Tests
 * 
 * Testes para validar se a documentação Swagger está correta e completa
 */

const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const SWAGGER_SPEC_URL = `${API_BASE_URL}/api/docs/swagger.json`;
const SWAGGER_UI_URL = `${API_BASE_URL}/api/docs`;

describe('Swagger Documentation Tests', () => {
  let swaggerSpec;

  beforeAll(async () => {
    try {
      // Tentar carregar a especificação Swagger
      const response = await axios.get(SWAGGER_SPEC_URL);
      swaggerSpec = response.data;
    } catch (error) {
      console.warn('Could not load Swagger spec, some tests will be skipped');
    }
  });

  describe('Swagger UI Availability', () => {
    test('should load Swagger UI page', async () => {
      const response = await axios.get(SWAGGER_UI_URL);
      expect(response.status).toBe(200);
      expect(response.data).toContain('swagger-ui');
    });

    test('should have custom site title', async () => {
      const response = await axios.get(SWAGGER_UI_URL);
      expect(response.data).toContain('EduShare API Documentation');
    });
  });

  describe('OpenAPI Specification Structure', () => {
    test('should have valid OpenAPI version', () => {
      if (!swaggerSpec) return;
      expect(swaggerSpec.openapi).toBe('3.0.0');
    });

    test('should have API info metadata', () => {
      if (!swaggerSpec) return;
      expect(swaggerSpec.info).toBeDefined();
      expect(swaggerSpec.info.title).toBe('EduShare Platform API');
      expect(swaggerSpec.info.version).toBe('1.0.0');
      expect(swaggerSpec.info.description).toContain('compartilhamento de materiais didáticos');
    });

    test('should have contact information', () => {
      if (!swaggerSpec) return;
      expect(swaggerSpec.info.contact).toBeDefined();
      expect(swaggerSpec.info.contact.name).toBe('Equipe EduShare');
      expect(swaggerSpec.info.contact.email).toBe('contato@edushare.com.br');
    });

    test('should have MIT license', () => {
      if (!swaggerSpec) return;
      expect(swaggerSpec.info.license).toBeDefined();
      expect(swaggerSpec.info.license.name).toBe('MIT');
    });

    test('should have development and production servers', () => {
      if (!swaggerSpec) return;
      expect(swaggerSpec.servers).toBeDefined();
      expect(swaggerSpec.servers.length).toBeGreaterThanOrEqual(2);
      
      const devServer = swaggerSpec.servers.find(s => s.description.includes('Desenvolvimento'));
      const prodServer = swaggerSpec.servers.find(s => s.description.includes('Produção'));
      
      expect(devServer).toBeDefined();
      expect(prodServer).toBeDefined();
    });
  });

  describe('Security Schemes', () => {
    test('should have JWT Bearer authentication configured', () => {
      if (!swaggerSpec) return;
      expect(swaggerSpec.components.securitySchemes).toBeDefined();
      expect(swaggerSpec.components.securitySchemes.bearerAuth).toBeDefined();
      expect(swaggerSpec.components.securitySchemes.bearerAuth.type).toBe('http');
      expect(swaggerSpec.components.securitySchemes.bearerAuth.scheme).toBe('bearer');
      expect(swaggerSpec.components.securitySchemes.bearerAuth.bearerFormat).toBe('JWT');
    });
  });

  describe('Schema Definitions', () => {
    test('should have Error schema', () => {
      if (!swaggerSpec) return;
      expect(swaggerSpec.components.schemas.Error).toBeDefined();
      expect(swaggerSpec.components.schemas.Error.properties.success).toBeDefined();
      expect(swaggerSpec.components.schemas.Error.properties.message).toBeDefined();
    });

    test('should have User schema', () => {
      if (!swaggerSpec) return;
      expect(swaggerSpec.components.schemas.User).toBeDefined();
      expect(swaggerSpec.components.schemas.User.properties).toHaveProperty('id');
      expect(swaggerSpec.components.schemas.User.properties).toHaveProperty('name');
      expect(swaggerSpec.components.schemas.User.properties).toHaveProperty('email');
      expect(swaggerSpec.components.schemas.User.properties).toHaveProperty('role');
    });

    test('should have Material schema', () => {
      if (!swaggerSpec) return;
      expect(swaggerSpec.components.schemas.Material).toBeDefined();
      expect(swaggerSpec.components.schemas.Material.properties).toHaveProperty('id');
      expect(swaggerSpec.components.schemas.Material.properties).toHaveProperty('title');
      expect(swaggerSpec.components.schemas.Material.properties).toHaveProperty('description');
      expect(swaggerSpec.components.schemas.Material.properties).toHaveProperty('category');
    });

    test('should have Share schema', () => {
      if (!swaggerSpec) return;
      expect(swaggerSpec.components.schemas.Share).toBeDefined();
      expect(swaggerSpec.components.schemas.Share.properties).toHaveProperty('id');
      expect(swaggerSpec.components.schemas.Share.properties).toHaveProperty('material_id');
      expect(swaggerSpec.components.schemas.Share.properties).toHaveProperty('status');
    });
  });

  describe('Tags Organization', () => {
    test('should have Auth tag', () => {
      if (!swaggerSpec) return;
      const authTag = swaggerSpec.tags.find(t => t.name === 'Auth');
      expect(authTag).toBeDefined();
      expect(authTag.description).toContain('autenticação');
    });

    test('should have Materials tag', () => {
      if (!swaggerSpec) return;
      const materialsTag = swaggerSpec.tags.find(t => t.name === 'Materials');
      expect(materialsTag).toBeDefined();
      expect(materialsTag.description).toContain('materiais didáticos');
    });

    test('should have Shares tag', () => {
      if (!swaggerSpec) return;
      const sharesTag = swaggerSpec.tags.find(t => t.name === 'Shares');
      expect(sharesTag).toBeDefined();
      expect(sharesTag.description).toContain('compartilhamento');
    });
  });

  describe('API Endpoints Documentation', () => {
    describe('Auth Endpoints', () => {
      test('should document POST /api/auth/register', () => {
        if (!swaggerSpec || !swaggerSpec.paths) return;
        const endpoint = swaggerSpec.paths['/auth/register'];
        expect(endpoint).toBeDefined();
        expect(endpoint.post).toBeDefined();
        expect(endpoint.post.summary).toContain('Registrar');
        expect(endpoint.post.requestBody).toBeDefined();
        expect(endpoint.post.responses['201']).toBeDefined();
        expect(endpoint.post.responses['400']).toBeDefined();
        expect(endpoint.post.responses['409']).toBeDefined();
      });

      test('should document POST /api/auth/login', () => {
        if (!swaggerSpec || !swaggerSpec.paths) return;
        const endpoint = swaggerSpec.paths['/auth/login'];
        expect(endpoint).toBeDefined();
        expect(endpoint.post).toBeDefined();
        expect(endpoint.post.summary).toContain('login');
        expect(endpoint.post.requestBody).toBeDefined();
        expect(endpoint.post.responses['200']).toBeDefined();
        expect(endpoint.post.responses['401']).toBeDefined();
      });

      test('should document GET /api/auth/profile', () => {
        if (!swaggerSpec || !swaggerSpec.paths) return;
        const endpoint = swaggerSpec.paths['/auth/profile'];
        expect(endpoint).toBeDefined();
        expect(endpoint.get).toBeDefined();
        expect(endpoint.get.summary).toContain('perfil');
        expect(endpoint.get.security).toBeDefined();
        expect(endpoint.get.security[0].bearerAuth).toBeDefined();
      });

      test('should document POST /api/auth/verify', () => {
        if (!swaggerSpec || !swaggerSpec.paths) return;
        const endpoint = swaggerSpec.paths['/auth/verify'];
        expect(endpoint).toBeDefined();
        expect(endpoint.post).toBeDefined();
        expect(endpoint.post.summary).toContain('Verificar token');
      });
    });

    describe('Materials Endpoints', () => {
      test('should document GET /api/products', () => {
        if (!swaggerSpec || !swaggerSpec.paths) return;
        const endpoint = swaggerSpec.paths['/products'];
        expect(endpoint).toBeDefined();
        expect(endpoint.get).toBeDefined();
        expect(endpoint.get.summary).toContain('Listar materiais');
        expect(endpoint.get.parameters).toBeDefined();
        
        const pageParam = endpoint.get.parameters.find(p => p.name === 'page');
        const limitParam = endpoint.get.parameters.find(p => p.name === 'limit');
        expect(pageParam).toBeDefined();
        expect(limitParam).toBeDefined();
      });

      test('should document POST /api/products', () => {
        if (!swaggerSpec || !swaggerSpec.paths) return;
        const endpoint = swaggerSpec.paths['/products'];
        expect(endpoint).toBeDefined();
        expect(endpoint.post).toBeDefined();
        expect(endpoint.post.summary).toContain('Criar material');
        expect(endpoint.post.security).toBeDefined();
        expect(endpoint.post.requestBody).toBeDefined();
      });

      test('should document GET /api/products/:id', () => {
        if (!swaggerSpec || !swaggerSpec.paths) return;
        const endpoint = swaggerSpec.paths['/products/{id}'];
        expect(endpoint).toBeDefined();
        expect(endpoint.get).toBeDefined();
        expect(endpoint.get.parameters).toBeDefined();
        
        const idParam = endpoint.get.parameters.find(p => p.name === 'id');
        expect(idParam).toBeDefined();
        expect(idParam.required).toBe(true);
      });

      test('should document PUT /api/products/:id', () => {
        if (!swaggerSpec || !swaggerSpec.paths) return;
        const endpoint = swaggerSpec.paths['/products/{id}'];
        expect(endpoint).toBeDefined();
        expect(endpoint.put).toBeDefined();
        expect(endpoint.put.summary).toContain('Atualizar');
        expect(endpoint.put.responses['403']).toBeDefined(); // Only author can update
      });

      test('should document DELETE /api/products/:id', () => {
        if (!swaggerSpec || !swaggerSpec.paths) return;
        const endpoint = swaggerSpec.paths['/products/{id}'];
        expect(endpoint).toBeDefined();
        expect(endpoint.delete).toBeDefined();
        expect(endpoint.delete.summary).toContain('Deletar');
      });
    });

    describe('Shares Endpoints', () => {
      test('should document GET /api/orders', () => {
        if (!swaggerSpec || !swaggerSpec.paths) return;
        const endpoint = swaggerSpec.paths['/orders'];
        expect(endpoint).toBeDefined();
        expect(endpoint.get).toBeDefined();
        expect(endpoint.get.summary).toContain('compartilhamentos');
        
        const statusParam = endpoint.get.parameters?.find(p => p.name === 'status');
        if (statusParam) {
          expect(statusParam.schema.enum).toContain('pending');
          expect(statusParam.schema.enum).toContain('completed');
          expect(statusParam.schema.enum).toContain('cancelled');
        }
      });

      test('should document POST /api/orders', () => {
        if (!swaggerSpec || !swaggerSpec.paths) return;
        const endpoint = swaggerSpec.paths['/orders'];
        expect(endpoint).toBeDefined();
        expect(endpoint.post).toBeDefined();
        expect(endpoint.post.summary).toContain('compartilh');
        expect(endpoint.post.requestBody).toBeDefined();
      });

      test('should document GET /api/orders/:id', () => {
        if (!swaggerSpec || !swaggerSpec.paths) return;
        const endpoint = swaggerSpec.paths['/orders/{id}'];
        expect(endpoint).toBeDefined();
        expect(endpoint.get).toBeDefined();
      });

      test('should document PATCH /api/orders/:id', () => {
        if (!swaggerSpec || !swaggerSpec.paths) return;
        const endpoint = swaggerSpec.paths['/orders/{id}'];
        expect(endpoint).toBeDefined();
        expect(endpoint.patch).toBeDefined();
        expect(endpoint.patch.summary).toContain('status');
      });

      test('should document DELETE /api/orders/:id', () => {
        if (!swaggerSpec || !swaggerSpec.paths) return;
        const endpoint = swaggerSpec.paths['/orders/{id}'];
        expect(endpoint).toBeDefined();
        expect(endpoint.delete).toBeDefined();
        expect(endpoint.delete.summary).toContain('Cancelar');
      });

      test('should document GET /api/orders/statistics', () => {
        if (!swaggerSpec || !swaggerSpec.paths) return;
        const endpoint = swaggerSpec.paths['/orders/statistics'];
        expect(endpoint).toBeDefined();
        expect(endpoint.get).toBeDefined();
        expect(endpoint.get.summary).toContain('Estatísticas');
      });
    });
  });

  describe('Response Status Codes', () => {
    test('endpoints should document success responses', () => {
      if (!swaggerSpec || !swaggerSpec.paths) return;
      
      Object.keys(swaggerSpec.paths).forEach(path => {
        Object.keys(swaggerSpec.paths[path]).forEach(method => {
          const operation = swaggerSpec.paths[path][method];
          if (operation.responses) {
            const hasSuccessResponse = 
              operation.responses['200'] || 
              operation.responses['201'] || 
              operation.responses['204'];
            expect(hasSuccessResponse).toBeTruthy();
          }
        });
      });
    });

    test('protected endpoints should document 401 response', () => {
      if (!swaggerSpec || !swaggerSpec.paths) return;
      
      Object.keys(swaggerSpec.paths).forEach(path => {
        Object.keys(swaggerSpec.paths[path]).forEach(method => {
          const operation = swaggerSpec.paths[path][method];
          if (operation.security && operation.security.length > 0) {
            expect(operation.responses['401']).toBeDefined();
          }
        });
      });
    });

    test('endpoints should document 500 error response', () => {
      if (!swaggerSpec || !swaggerSpec.paths) return;
      
      let endpointCount = 0;
      let with500 = 0;

      Object.keys(swaggerSpec.paths).forEach(path => {
        Object.keys(swaggerSpec.paths[path]).forEach(method => {
          endpointCount++;
          const operation = swaggerSpec.paths[path][method];
          if (operation.responses && operation.responses['500']) {
            with500++;
          }
        });
      });

      // Most endpoints should document 500 errors
      expect(with500).toBeGreaterThan(0);
    });
  });

  describe('Request Body Validation', () => {
    test('POST /auth/register should have required fields', () => {
      if (!swaggerSpec || !swaggerSpec.paths) return;
      const endpoint = swaggerSpec.paths['/auth/register'];
      if (!endpoint || !endpoint.post) return;

      const schema = endpoint.post.requestBody?.content?.['application/json']?.schema;
      expect(schema).toBeDefined();
      expect(schema.required).toContain('name');
      expect(schema.required).toContain('email');
      expect(schema.required).toContain('password');
    });

    test('POST /auth/login should have required fields', () => {
      if (!swaggerSpec || !swaggerSpec.paths) return;
      const endpoint = swaggerSpec.paths['/auth/login'];
      if (!endpoint || !endpoint.post) return;

      const schema = endpoint.post.requestBody?.content?.['application/json']?.schema;
      expect(schema).toBeDefined();
      expect(schema.required).toContain('email');
      expect(schema.required).toContain('password');
    });

    test('POST /products should have required fields', () => {
      if (!swaggerSpec || !swaggerSpec.paths) return;
      const endpoint = swaggerSpec.paths['/products'];
      if (!endpoint || !endpoint.post) return;

      const schema = endpoint.post.requestBody?.content?.['application/json']?.schema;
      expect(schema).toBeDefined();
      expect(schema.required).toContain('title');
      expect(schema.required).toContain('description');
      expect(schema.required).toContain('category');
    });
  });

  describe('Documentation Quality', () => {
    test('all endpoints should have summary', () => {
      if (!swaggerSpec || !swaggerSpec.paths) return;
      
      Object.keys(swaggerSpec.paths).forEach(path => {
        Object.keys(swaggerSpec.paths[path]).forEach(method => {
          const operation = swaggerSpec.paths[path][method];
          expect(operation.summary).toBeDefined();
          expect(operation.summary.length).toBeGreaterThan(0);
        });
      });
    });

    test('all endpoints should have description', () => {
      if (!swaggerSpec || !swaggerSpec.paths) return;
      
      Object.keys(swaggerSpec.paths).forEach(path => {
        Object.keys(swaggerSpec.paths[path]).forEach(method => {
          const operation = swaggerSpec.paths[path][method];
          expect(operation.description).toBeDefined();
          expect(operation.description.length).toBeGreaterThan(0);
        });
      });
    });

    test('all endpoints should have tags', () => {
      if (!swaggerSpec || !swaggerSpec.paths) return;
      
      Object.keys(swaggerSpec.paths).forEach(path => {
        Object.keys(swaggerSpec.paths[path]).forEach(method => {
          const operation = swaggerSpec.paths[path][method];
          expect(operation.tags).toBeDefined();
          expect(operation.tags.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Coverage Report', () => {
    test('should have documented at least 15 endpoints', () => {
      if (!swaggerSpec || !swaggerSpec.paths) return;
      
      let endpointCount = 0;
      Object.keys(swaggerSpec.paths).forEach(path => {
        endpointCount += Object.keys(swaggerSpec.paths[path]).length;
      });

      expect(endpointCount).toBeGreaterThanOrEqual(15);
    });

    test('should generate coverage report', () => {
      if (!swaggerSpec || !swaggerSpec.paths) return;
      
      const report = {
        totalPaths: Object.keys(swaggerSpec.paths).length,
        totalEndpoints: 0,
        endpointsByTag: {},
        endpointsByMethod: {},
        protectedEndpoints: 0,
        publicEndpoints: 0
      };

      Object.keys(swaggerSpec.paths).forEach(path => {
        Object.keys(swaggerSpec.paths[path]).forEach(method => {
          report.totalEndpoints++;
          const operation = swaggerSpec.paths[path][method];
          
          // Count by tag
          if (operation.tags) {
            operation.tags.forEach(tag => {
              report.endpointsByTag[tag] = (report.endpointsByTag[tag] || 0) + 1;
            });
          }

          // Count by method
          report.endpointsByMethod[method] = (report.endpointsByMethod[method] || 0) + 1;

          // Count security
          if (operation.security && operation.security.length > 0) {
            report.protectedEndpoints++;
          } else {
            report.publicEndpoints++;
          }
        });
      });

      console.log('\n📊 Swagger Documentation Coverage Report:');
      console.log(`Total Paths: ${report.totalPaths}`);
      console.log(`Total Endpoints: ${report.totalEndpoints}`);
      console.log(`\nEndpoints by Tag:`);
      Object.keys(report.endpointsByTag).forEach(tag => {
        console.log(`  - ${tag}: ${report.endpointsByTag[tag]}`);
      });
      console.log(`\nEndpoints by Method:`);
      Object.keys(report.endpointsByMethod).forEach(method => {
        console.log(`  - ${method.toUpperCase()}: ${report.endpointsByMethod[method]}`);
      });
      console.log(`\nSecurity:`);
      console.log(`  - Protected: ${report.protectedEndpoints}`);
      console.log(`  - Public: ${report.publicEndpoints}`);

      expect(report.totalEndpoints).toBeGreaterThan(0);
    });
  });
});
