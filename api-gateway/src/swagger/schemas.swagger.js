/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Endpoints de autenticação e gerenciamento de usuários
 *   - name: Materials
 *     description: Gerenciamento de materiais didáticos
 *   - name: Shares
 *     description: Gestão de compartilhamento de materiais
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *         - role
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único do usuário
 *           example: 1
 *         name:
 *           type: string
 *           description: Nome completo do professor
 *           example: Maria Silva
 *         email:
 *           type: string
 *           format: email
 *           description: E-mail do professor
 *           example: maria.silva@escola.edu.br
 *         role:
 *           type: string
 *           enum: [teacher, admin]
 *           description: Papel do usuário no sistema
 *           example: teacher
 *         school:
 *           type: string
 *           description: Nome da escola
 *           example: EMEF Prof. João da Silva
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Data de criação da conta
 *           example: 2026-02-21T10:30:00Z
 *     
 *     Material:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - description
 *         - category
 *         - author_id
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único do material
 *           example: 1
 *         title:
 *           type: string
 *           description: Título do material didático
 *           example: Apostila de Matemática - Frações
 *         description:
 *           type: string
 *           description: Descrição detalhada do material
 *           example: Material completo sobre frações para ensino fundamental
 *         category:
 *           type: string
 *           description: Categoria do material
 *           example: Matemática
 *         author_id:
 *           type: integer
 *           description: ID do professor autor
 *           example: 1
 *         file_url:
 *           type: string
 *           description: URL do arquivo
 *           example: https://storage.edushare.com/materials/123.pdf
 *         grade_level:
 *           type: string
 *           description: Ano/série escolar
 *           example: 5º ano
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *           example: 2026-02-21T10:30:00Z
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *           example: 2026-02-21T10:30:00Z
 *     
 *     Share:
 *       type: object
 *       required:
 *         - id
 *         - material_id
 *         - teacher_id
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único do compartilhamento
 *           example: 1
 *         material_id:
 *           type: integer
 *           description: ID do material compartilhado
 *           example: 1
 *         teacher_id:
 *           type: integer
 *           description: ID do professor que solicitou
 *           example: 2
 *         status:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *           description: Status do compartilhamento
 *           example: completed
 *         notes:
 *           type: string
 *           description: Observações sobre o compartilhamento
 *           example: Material excelente, muito útil!
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Data da solicitação
 *           example: 2026-02-21T10:30:00Z
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 *           example: 2026-02-21T10:30:00Z
 *     
 *     Error:
 *       type: object
 *       required:
 *         - success
 *         - message
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indica se a operação foi bem-sucedida
 *           example: false
 *         message:
 *           type: string
 *           description: Mensagem de erro detalhada
 *           example: Erro ao processar solicitação
 *         error:
 *           type: string
 *           description: Código ou tipo do erro
 *           example: VALIDATION_ERROR
 */

module.exports = {};
