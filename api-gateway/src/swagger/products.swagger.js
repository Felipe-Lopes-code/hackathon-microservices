/**
 * @swagger
 * /products:
 *   get:
 *     summary: Listar materiais didáticos
 *     description: Retorna lista paginada de materiais didáticos disponíveis na plataforma
 *     tags: [Materials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Quantidade de itens por página
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoria (Matemática, Português, etc.)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por título ou descrição
 *     responses:
 *       200:
 *         description: Lista de materiais retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Material'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 100
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Criar material didático
 *     description: Permite que um professor crie um novo material didático
 *     tags: [Materials]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: Plano de Aula - Frações
 *                 description: Título do material
 *               description:
 *                 type: string
 *                 example: Material completo para ensino de frações no 5º ano
 *                 description: Descrição detalhada do material
 *               category:
 *                 type: string
 *                 example: Matemática
 *                 description: Categoria/disciplina do material
 *               grade_level:
 *                 type: string
 *                 example: 5º ano
 *                 description: Nível escolar recomendado
 *               file_url:
 *                 type: string
 *                 example: https://storage.edushare.com/materials/fracoes.pdf
 *                 description: URL do arquivo do material
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [frações, matemática básica, ensino fundamental]
 *                 description: Tags para facilitar busca
 *     responses:
 *       201:
 *         description: Material criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Material criado com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/Material'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obter material específico
 *     description: Retorna detalhes completos de um material didático específico
 *     tags: [Materials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do material
 *     responses:
 *       200:
 *         description: Material retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Material'
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Material não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Atualizar material
 *     description: Permite que o autor atualize um material didático
 *     tags: [Materials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do material
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Plano de Aula - Frações (Atualizado)
 *               description:
 *                 type: string
 *                 example: Material completo e atualizado para ensino de frações
 *               category:
 *                 type: string
 *                 example: Matemática
 *               grade_level:
 *                 type: string
 *                 example: 5º ano
 *               file_url:
 *                 type: string
 *                 example: https://storage.edushare.com/materials/fracoes-v2.pdf
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [frações, matemática básica, ensino fundamental]
 *     responses:
 *       200:
 *         description: Material atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Material atualizado com sucesso
 *                 data:
 *                   $ref: '#/components/schemas/Material'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Não autorizado (apenas o autor pode atualizar)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Material não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Deletar material
 *     description: Permite que o autor delete um material didático
 *     tags: [Materials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do material
 *     responses:
 *       200:
 *         description: Material deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Material deletado com sucesso
 *       401:
 *         description: Token inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Não autorizado (apenas o autor pode deletar)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Material não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

module.exports = {};
